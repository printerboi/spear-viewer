import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { PROJECTDIR } from '../extension';
import util from 'util';
import { SETTINGS } from "../helper/extensionConstants";
import { ConfigParser } from "../helper/configParser";
const exec = util.promisify(require('child_process').exec);

async function compileToll(filepath: string){
    const extension = path.extname(filepath);
    const filename = path.basename(filepath, extension);
    return await exec(`clang++ -gmlt -fdebug-info-for-profiling -O0 -Xclang -disable-O0-optnone -fno-discard-value-names -S -emit-llvm -o ${PROJECTDIR}/compiled/${filename}.ll ${filepath}`);
}

async function linkFiles(files: Array<string>){
    let filePathArray: Array<string> = [];

    for(let i=0; i < files.length; i++){
        const extension = path.extname(files[i]);
        const filename = path.basename(files[i], extension);

        filePathArray.push(`${PROJECTDIR}/compiled/${filename}.ll`);
    }

    return await exec(`llvm-link -f ${filePathArray.join(" ")} -o ${PROJECTDIR}/compiled/compilation_unit.bc`);
}

async function bcToll(fileName: string){
    const filePath = `${PROJECTDIR}/compiled/${fileName}.bc`;
    return await exec(`llvm-dis -f ${filePath} -o ${PROJECTDIR}/compiled/compilation_unit.ll`);
}


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
        const profilepath = `${PROJECTDIR}/profile.json`;
        
        // Check if the profile is present
        if(fs.existsSync(profilepath)){
            const configValid = ConfigParser.validateConfig();

            if(configValid){
                // Check if a compiled folder is present in the temp folder, if not create it
                try{
                    if(!fs.existsSync(`${PROJECTDIR}/compiled`)){
                        fs.mkdirSync(`${PROJECTDIR}/compiled`);
                    }

                    const files = ConfigParser.getFiles();
                    console.log(files);

                    let compilationErrorOccured = false;
                    for(let i=0; i < files.length; i++){
                        // Execute the compile process for the open file
                        const { error: compileError } = await compileToll(files[i]);
                        if(compileError){
                            vscode.window.showErrorMessage(`File ${files[i]} could not be compiled!\n\n Reason:\n${compileError}`);
                            compilationErrorOccured = true;
                        }
                    }

                    if(!compilationErrorOccured){
                        // If the compilation ran successfully, execute the graph analysis
                        console.log("Compilation finished!");

                        const { error: linkError } = await linkFiles(files);
                        console.log(linkError);

                        if(!linkError){
                            const { error: bcError } = await bcToll("compilation_unit");

                            if(!bcError){
                                console.log("Linking process done!");
                                let instructionCommand = `${APPPATH} analyze --profile ${profilepath} --mode instruction --format json --strategy ${STRATEGY} --loopbound ${LOOPBOUND} --withCalls --program ${PROJECTDIR}/compiled/compilation_unit.ll`;
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
                            }else{
                                vscode.window.showErrorMessage(`Converting of compilation unit to LLVM IR failed! Reason: ${linkError}`);
                            }
                        }else{
                            vscode.window.showErrorMessage(`Linking of configured files failed! Reason: ${linkError}`);
                        }
                    }
                    
                }catch(e){
                    console.error(e);
                    vscode.window.showErrorMessage(`The analysis could not be generated! If you feel like this is possibly a bug, please create an issue on gihub!`);
                }
            }else{
                vscode.window.showErrorMessage("Config invalid! Please refer to the documentation!");
            }
        }else{
            vscode.window.showErrorMessage("No profile found!. Please profile the system first");
        }
    }
}