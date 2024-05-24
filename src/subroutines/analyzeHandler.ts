import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { TMPDIR } from '../extension';
import util from 'util';
import { SETTINGS } from "../helper/extensionConstants";
const exec = util.promisify(require('child_process').exec);


export default async function analyzeHandler() {
    let activeEditor = vscode.window.activeTextEditor;
    const APPPATH = SETTINGS.getAPPPATH();
    const LOOPBOUND = SETTINGS.getLOOPBOUND();
    const STRATEGY = SETTINGS.getSTRATEGY();

    
    if(activeEditor){
        const currOpenFile = activeEditor.document.uri;
        const extension = path.extname(currOpenFile.fsPath);
        const filename = path.basename(currOpenFile.fsPath, extension);

        // Path to the energy profile in the temporary directory of the device 
        const profilepath = `${TMPDIR}/profile.json`;
        
        // Check if the profile is present
        if(fs.existsSync(profilepath)){
            // We need to validate that we encountered a c++ file
            if(extension === ".cpp"){
                // Check if a compiled folder is present in the temp folder, if not create it
                try{
                    if(!fs.existsSync(`${TMPDIR}/compiled`)){
                        fs.mkdirSync(`${TMPDIR}/compiled`);
                    }

                    // Execute the compile process for the open file
                    const { error: compileError } = await exec(`clang++ -gmlt -fdebug-info-for-profiling -O0 -Xclang -disable-O0-optnone -fno-discard-value-names -S -emit-llvm -o ${TMPDIR}/compiled/${filename}.ll ${currOpenFile.fsPath}`);
                    if(compileError){
                        vscode.window.showErrorMessage(`File could not be compiled!\n\n Reason:\n${compileError}`);
                    }else{
                        // If the compilation ran successfully, execute the graph analysis
                        console.log("Compilation finished!");

                        let instructionCommand = `${APPPATH} analyze --profile ${profilepath} --mode instruction --format json --strategy ${STRATEGY} --loopbound ${LOOPBOUND} --withCalls --program ${TMPDIR}/compiled/${filename}.ll`;
                        /* if(params && params.functionname !== ""){
                            console.log(params.functionname);

                            graphCommand = `${APPPATH} analyze --profile ${profilepath} --mode graph --format json --strategy worst --loopbound 100 --withCalls --forFunction ${params.functionname} --program ${TMPDIR}/compiled/${filename}.ll > ${TMPDIR}/graph.dot`;
                        } */

                        const {stdout, stderr} = await exec(instructionCommand);

                        
                        
                        if(stderr){
                            console.error(stderr);
                            vscode.window.showErrorMessage(`The graph could not be generated!`);
                        }else{
                            try{
                                let analysisResult = JSON.parse(stdout);
                                console.log(analysisResult);


                                const fileDocument = activeEditor.document;
                                const uri = vscode.Uri.parse(`spearenergy://${fileDocument.fileName}?analysisresult=${encodeURIComponent(JSON.stringify(analysisResult))}`);
                                const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
                                await vscode.window.showTextDocument(doc, { preview: true });

                            }catch(e){
                                console.error(e);
                                vscode.window.showErrorMessage(`The analysis resulted in undefined output!`);
                            }
                        }
                    }
                    
                }catch(e){
                    console.error(e);
                    vscode.window.showErrorMessage(`The analysis could not be generated! If you feel like this is possibly a bug, please create an issue on gihub!`);
                }
            }else{
                vscode.window.showErrorMessage("The current file is not a c++ file!");
            }
        }else{
            vscode.window.showErrorMessage("No profile found!. Please profile the system first");
        }
    }
}