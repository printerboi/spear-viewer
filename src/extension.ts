// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from "os";
import { APPPREFIX } from './helper/extensionConstants';
import generateGraph, { GenerateGraphParameters } from './subroutines/generateGraph';
import profile from './subroutines/profile';
import { triggerDecorationUpdate } from './subroutines/decorationHandler';
import analyzeHandler from './subroutines/analyzeHandler';
import { energyEditorProvider } from './editors/virtualEnergyEditor';
import { SpearSidebarViewProvider } from './sidebar/SpearSidebarViewProvider';
import { SpearSidebarProfileProvider } from './sidebar/SpearSidebarProfileView';

//export let TMPDIR: string = "";
export let PROJECTDIR: string = "";
export let CONFIGPATH: string = "";
export let CONFIGLOCATION: string = "";
export const ProfileProvider = new SpearSidebarProfileProvider();


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("Creating tmp dir...");
	try {
		//TMPDIR = fs.mkdtempSync(path.join(os.tmpdir(), APPPREFIX));
		
		// Use the console to output diagnostic information (console.log) and errors (console.error)
		// This line of code will only be executed once when your extension is activated
		console.log('Spear-viewer active!');

		let activeEditor = vscode.window.activeTextEditor;
		const OverviewProvider = new SpearSidebarViewProvider(context.extensionUri);

		if(vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0){
			CONFIGPATH = `${vscode.workspace.workspaceFolders[0].uri.fsPath}/spear.yml`;
			PROJECTDIR = `${vscode.workspace.workspaceFolders[0].uri.fsPath}/.spear`;
			CONFIGLOCATION = `${vscode.workspace.workspaceFolders[0].uri.fsPath}`;

			if(!fs.existsSync(CONFIGPATH)){
				vscode.window.showInformationMessage('No spear config file was provided. Please create one first!', "Create", "Later...")
				.then((value) => {
					console.log(value);
					if(value === "Create"){
						const projectFileStream = fs.createWriteStream(CONFIGPATH);

						const sampleConfig = fs.readFileSync(`${context.extensionPath}/util/sample.config.yml`);
						projectFileStream.write(sampleConfig);
						projectFileStream.end();
						fs.mkdirSync(PROJECTDIR);
						vscode.window.showInformationMessage("Spear config created!");
					}
				});
			}
			
			context.subscriptions.push(
				/**
				 * Command to generate the graph for the currently open editor
				 */
				vscode.commands.registerCommand('spear-viewer.graph', async (params: GenerateGraphParameters) => {
					generateGraph(params);
				}),
				
	
				/**
				 * Profiles the device and saves the generated profile in the tempory directory of the application
				 */
				vscode.commands.registerCommand('spear-viewer.profile', async () => {
					// [TODO]: Validate config here
					profile();
				}),
	
				vscode.commands.registerCommand('spear-viewer.analyze', async () => {
					analyzeHandler();
				}),
	
				vscode.window.registerWebviewViewProvider(SpearSidebarViewProvider.viewType, OverviewProvider),
	
				vscode.window.registerTreeDataProvider("spearsidebar.profile", ProfileProvider),
	
				vscode.commands.registerCommand('spear-viewer.profile.refreshEntry', () =>
					ProfileProvider.refresh()
				),
	
				/**
				 * Opens a readonly editor and display the code with energy highlighting
				 */
				vscode.workspace.registerTextDocumentContentProvider("spearenergy", energyEditorProvider),
			);
		}

		if (activeEditor) {
			triggerDecorationUpdate(true, activeEditor, context);
		}

		vscode.window.onDidChangeActiveTextEditor(editor => {
			activeEditor = editor;
			if (editor) {
				triggerDecorationUpdate(false, activeEditor, context);
			}
		}, null, context.subscriptions);
	
		vscode.workspace.onDidChangeTextDocument(event => {
			if (activeEditor && event.document === activeEditor.document) {
				triggerDecorationUpdate(true, activeEditor, context);
			}
		}, null, context.subscriptions);


	}catch(e){
		console.error(e);
		vscode.window.showErrorMessage('Error activating spear. A temporary directory could not be created!');
	}

	
}

// This method is called when your extension is deactivated
export function deactivate() {
	/* try {
		if (TMPDIR) {
			fs.rmSync(TMPDIR, { recursive: true });
		}
	}
	catch (e) {
		vscode.window.showInformationMessage(`An error has occurred while removing the temporary directory at ${TMPDIR}. Please remove it manually. Error: ${e}`);
	} */
}
