// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';;
import * as os from "os";
import { Settings } from './types/spearsettings';
const execAsync = require('child_process').exec;

import util from 'util';
import { GraphViewer } from './components/graphViewer';
const exec = util.promisify(require('child_process').exec);

let tmpDir: string = "";
const appPrefix = 'spear-viewer';

const settings: Settings = {
	profile: {
		iterations: 100,
		programs: "/home/max/Documents/workbench/spear/profile/src",
		askpass: "/usr/bin/ksshaskpass"
	},
	spearPath: "/home/max/Documents/workbench/spear/cmake-build-debug/spear"
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("Creating tmp dir...");
	try {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
		
		// Use the console to output diagnostic information (console.log) and errors (console.error)
		// This line of code will only be executed once when your extension is activated
		console.log('Spear-viewer active!');

		
		context.subscriptions.push(
			vscode.commands.registerCommand('spear-viewer.graph', async () => {
			// [TODO]: Validate config here

			const launchWindow = () => {
				// Create and show a new webview
				const panel = vscode.window.createWebviewPanel(
					'graphView', // Identifies the type of the webview. Used internally
					'Spear graph', // Title of the panel displayed to the user
					vscode.ViewColumn.One, // Editor column to show the new webview panel in.
					{
						// Only allow the webview to access resources in our extension's media directory
						localResourceRoots: [vscode.Uri.file(`${tmpDir}`)]
					}
				);
				 
				// Get path to resource on disk
				const onDiskUri = vscode.Uri.file(`${tmpDir}/graph.pdf`);

				// And get the special URI to use with the webview
				const graphSrc = panel.webview.asWebviewUri(onDiskUri);
				panel.webview.html = GraphViewer(graphSrc);
			};

			if(vscode.window.activeTextEditor !== undefined){
					const currOpenFile = vscode.window.activeTextEditor.document.uri;
					const extension = path.extname(currOpenFile.fsPath);
					const filename = path.basename(currOpenFile.fsPath, extension);
					const profilepath = `${tmpDir}/profile.json`;
					
					if(extension === ".cpp"){
						
						try{
							if(!fs.existsSync(`${tmpDir}/compiled`)){
								fs.mkdirSync(`${tmpDir}/compiled`);
							}

							const { error: compileError } = await exec(`clang++ -g -O0 -Xclang -disable-O0-optnone -fno-discard-value-names -S -emit-llvm -o ${tmpDir}/compiled/${filename}.ll ${currOpenFile.fsPath}`);
							if(compileError){
								vscode.window.showErrorMessage(`File could not be compiled!\n\n Reason:\n${compileError}`);
							}else{
								//vscode.window.showInformationMessage("Spear compilation finished!");
								console.log("Compilation finished!");
								const { graphgenerationError } = await exec(`${settings.spearPath} analyze --profile ${profilepath} --mode graph --format json --strategy worst --loopbound 100 --withCalls --program ${tmpDir}/compiled/${filename}.ll > ${tmpDir}/graph.dot`)
								if(graphgenerationError){
									console.error(graphgenerationError);
									vscode.window.showErrorMessage(`Generation of the graph failed!`);
								}else{
									const { pdfConvertError } = await exec(`dot -Tpdf ${tmpDir}/graph.dot > ${tmpDir}/graph.pdf`);
									if(pdfConvertError){
										console.error(pdfConvertError);
										vscode.window.showErrorMessage(`Could not generate viewable graph!`);
									}else{
										//launchWindow();
										const { pdfViewerError } = await exec(`xdg-open ${tmpDir}/graph.pdf`);
										if(pdfViewerError){
											console.error(pdfViewerError);
											vscode.window.showErrorMessage(`Error opening pdf file!`);
										}
									}
								}
							}
							
						}catch(e){
							console.error(e);
						}
						
						
					}else{
						vscode.window.showErrorMessage("The current file is not a c++ file!");
					}
				}
			}),

			vscode.commands.registerCommand('spear-viewer.helloWorld', () => {
				// The code you place here will be executed every time your command is executed
				// Display a message box to the user
				vscode.window.showInformationMessage('Hello World from spear-viewer!!!');
			}),

			vscode.commands.registerCommand('spear-viewer.profile', async () => {
				// [TODO]: Validate config here

				try {
					if(!fs.existsSync(`${tmpDir}/profilecode`)){
						fs.mkdirSync(`${tmpDir}/profilecode`);
					}

					const compiledFolderContent = fs.readdirSync(`${tmpDir}/profilecode`);
					const validFolder = compiledFolderContent.includes("call") && 
						compiledFolderContent.includes("memoryread") &&
						compiledFolderContent.includes("programflow") &&
						compiledFolderContent.includes("division") &&
						compiledFolderContent.includes("stdbinary");


					if(!validFolder){
						const programsToCompile = fs.readdirSync(settings.profile.programs);
						try{
							for(let i = 0; i < programsToCompile.length; i++){
								const file = programsToCompile[i];
								const fileName = path.basename(file, ".ll");
								const programPath = `${settings.profile.programs}/${file}`;

								if(!fs.lstatSync(programPath).isDirectory() ){
				
									// Generate the llvm bytecode
									const { error: bytecodeError } = await exec(`llvm-as ${programPath} -o ${tmpDir}/profilecode/${fileName}.bc`);
									if(bytecodeError){
										throw Error(bytecodeError.toString());
									}

									// Generate the object file
									const { error: objectfileError } = await exec(`llc -O0 -filetype=obj ${tmpDir}/profilecode/${fileName}.bc`);
									if(objectfileError){
										throw Error(objectfileError.toString());
									}

									// Generate the binary file
									const { error: binaryfileError } = await exec(`clang++ -O0 -no-pie ${tmpDir}/profilecode/${fileName}.o -o ${tmpDir}/profilecode/${fileName}`);
									if(binaryfileError){
										throw Error(binaryfileError.toString());
									}
								}
							}
						}catch(e){
							console.error(e);
							vscode.window.showErrorMessage('Profiling failed during compilation of the profile code');
						}
					}
					

					try{
						vscode.window.showInformationMessage('Starting the profiling. This may take some while! Grab a coffee ☕');

						/* Execute spear with sudo rights.
						* This code is really prone to error
						* If the user aborts the askass, the command fails which cannot be detected 
						*/
						execAsync(`SUDO_ASKPASS=${settings.profile.askpass} sudo -A ${settings.spearPath} profile --iterations ${settings.profile.iterations} --model ${tmpDir}/profilecode --savelocation ${tmpDir}`, (error: any, output: any) => {
							if(error){
								throw error;
							}else{
								vscode.window.showInformationMessage('Profiling finished successfully!');
							}
						});

					}catch(e){
						console.error(e);
						vscode.window.showErrorMessage('Profiling failed!');
					}
				}catch(e){
					console.error(e);
					vscode.window.showErrorMessage('Error creating folder for the compiled profile code!');
				}
			})
		);
	}catch(e){
		console.error(e);
		vscode.window.showErrorMessage('Error activating spear. A temporary directory could not be created!');
	}

	
}

// This method is called when your extension is deactivated
export function deactivate() {
	try {
		if (tmpDir) {
			fs.rmSync(tmpDir, { recursive: true });
		}
	}
	catch (e) {
		vscode.window.showInformationMessage(`An error has occurred while removing the temporary directory at ${tmpDir}. Please remove it manually. Error: ${e}`);
	}
}
