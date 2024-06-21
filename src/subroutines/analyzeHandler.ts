import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { PROJECTDIR, initialized } from '../extension';
import util from 'util';
import { SETTINGS } from "../helper/extensionConstants";
import { AnalysisOptions, ConfigParser, strategyToString } from "../helper/configParser";
import { LogType, Logger } from "../helper/logger";
import { Callgraph, FileFunction, FileFunctionMapping, SpearFunction, SpearInstruction, SpearNode } from "../types/AnalysisTypes";
const exec = util.promisify(require('child_process').exec);


async function compileToll(filepath: string){
    const extension = path.extname(filepath);
    const filename = path.basename(filepath, extension);
    try{
        return await exec(`clang++ -gmlt -fdebug-info-for-profiling -O0 -Xclang -disable-O0-optnone -fno-discard-value-names -S -emit-llvm -o ${PROJECTDIR}/compiled/${filename}.ll ${filepath}`);
    }catch(e){
        Logger.log(LogType.ERROR, `Compilation error: ${e}`);
        return {error: true};
    }
}

async function linkFiles(files: Array<string>){
    let filePathArray: Array<string> = [];

    for(let i=0; i < files.length; i++){
        const extension = path.extname(files[i]);
        const filename = path.basename(files[i], extension);

        filePathArray.push(`${PROJECTDIR}/compiled/${filename}.ll`);
    }

    try{
        return await exec(`llvm-link -f ${filePathArray.join(" ")} -o ${PROJECTDIR}/compiled/compilation_unit.bc`);
    }catch(e){
        Logger.log(LogType.ERROR, `Link error: ${e}`);
        return {error: true};
    }
}

async function bcToll(fileName: string){
    const filePath = `${PROJECTDIR}/compiled/${fileName}.bc`;
    try{
        return await exec(`llvm-dis -f ${filePath} -o ${PROJECTDIR}/compiled/compilation_unit.ll`);
    }catch(e){
        Logger.log(LogType.ERROR, `Bitcode conversion: ${e}`);
        return {error: true};
    }
}

export function getFunctionsPerFile(): FileFunctionMapping{
    const resultFile = path.join(PROJECTDIR, "analysis.json");
    let files: FileFunctionMapping = {};

    if(PROJECTDIR && ConfigParser.configExists()){
        if(fs.existsSync(resultFile)){
            try{
                const resultFileContent = fs.readFileSync(resultFile).toString();
                try{
                    let analysisResult = JSON.parse(resultFileContent);
    
                    for(let i = 0; i < analysisResult.functions.length; i++){
                        const functionObject: SpearFunction = analysisResult.functions[i];
                        if(!functionObject.external){
                            if(files[functionObject.file] === undefined){
                                files[functionObject.file] = [ { name: functionObject.demangled, energy: functionObject["energy"], calledFunctions: getCalledFunctions(functionObject) } ];
                            }else{
                                files[functionObject.file].push({ name: functionObject.demangled, energy: functionObject["energy"], calledFunctions: getCalledFunctions(functionObject) });
                            }
                        }
                    }
                }catch(e){
                    console.error(e);
                    vscode.window.showErrorMessage(`The analysis resulted in undefined output!`);
                }
            }catch(e){
                vscode.window.showErrorMessage("Analysis result file could not be parsed! Please run the analysis again");
            }
        }else{
            if(ConfigParser.profileExists()){
                vscode.window.showInformationMessage(`No analysis result found! Did you ran the analysis previously?`);
            }else{
                vscode.window.showInformationMessage(`Please generate a profile!`);
            }
        }
    }else{
        ConfigParser.presentConfigCreationDialog();
    }

    return files;
}

export function getCallGraph(): Callgraph{
    const resultFile = path.join(PROJECTDIR, "analysis.json");
    const functions: Callgraph = {};

    if(PROJECTDIR && ConfigParser.configExists()){
        if(fs.existsSync(resultFile)){
            try{
                const resultFileContent = fs.readFileSync(resultFile).toString();
                try{
                    let analysisResult = JSON.parse(resultFileContent);
                    let test = "";
    
                    for(let i = 0; i < analysisResult.functions.length; i++){
                        const functionObject: SpearFunction = analysisResult.functions[i];

                        console.log(functionObject.demangled);

                        if(!functionObject.external){
                            if(functions[functionObject.name] === undefined){
                                functions[functionObject.name] = { name: functionObject.name, demangled: functionObject.demangled, energy: functionObject["energy"], calledFunctions: getCalledFunctions(functionObject), path: functionObject.file };
                            }
                        }
                    }
                }catch(e){
                    console.error(e);
                    vscode.window.showErrorMessage(`The analysis resulted in undefined output!`);
                }
            }catch(e){
                vscode.window.showErrorMessage("Analysis result file could not be parsed! Please run the analysis again");
            }
        }else{
            if(ConfigParser.profileExists()){
                vscode.window.showInformationMessage(`No analysis result found! Did you ran the analysis previously?`);
            }else{
                vscode.window.showInformationMessage(`Please generate a profile!`);
            }
        }
    }else{
        ConfigParser.presentConfigCreationDialog();
    }

    return functions;
}


function getCalledFunctions(functionObject: SpearFunction): Array<string>{
    const foundFunctionNames: Array<string> = [];
    
    if(functionObject.nodes !== undefined){
        for(let i = 0; i < functionObject.nodes.length; i++){
            const node: SpearNode = functionObject.nodes[i];
            if(node.instructions !== undefined){
                for(let j = 0; j < node.instructions.length; j++){
                    let instruction: SpearInstruction = node.instructions[j];
                    if(instruction.calledFunction !== undefined && !foundFunctionNames.includes(instruction.calledFunction)){
                        foundFunctionNames.push(instruction.calledFunction);
                    }
                }
            }
        }
    }


    return foundFunctionNames;
}

export async function openAnalysisEditor(fileToOpen: string) {
    const fileList = ConfigParser.getFiles();

    console.log(fileList);
    console.log(fileToOpen);

    if(ConfigParser.configExists()){
        if(fileList.includes(fileToOpen)){
            const resultFile = path.join(PROJECTDIR, "analysis.json");
            if(fs.existsSync(resultFile)){
                try{
                    const resultFileContent = fs.readFileSync(resultFile).toString();
                    try{
                        let analysisResult = JSON.parse(resultFileContent);
                        console.log(analysisResult);        
            
                        const fileDocument = fileToOpen;
                        const uri = vscode.Uri.parse(`spearenergy://${fileDocument}?analysisresult=${encodeURIComponent(JSON.stringify(analysisResult))}`);
                        const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
                        await vscode.window.showTextDocument(doc, { preview: false });
            
                    }catch(e){
                        console.error(e);
                        vscode.window.showErrorMessage(`The analysis resulted in undefined output!`);
                    }
                }catch(e){
                    vscode.window.showErrorMessage("Analysis result file could not be parsed! Please run the analysis again");
                }
            }else{
                vscode.window.showInformationMessage(`No analysis result found! Did you ran the analysis previously?`);
            }
        }else{
            vscode.window.showErrorMessage(`The file ${fileToOpen} was not analyzed!`);
        }
    }else{
        if(!ConfigParser.profileExists()){
            vscode.window.showInformationMessage(`Please generate a profile!`);
        }
    }
}


export default async function analyzeHandler() {
    // Path to the energy profile in the temporary directory of the device 
    const profilepath = `${PROJECTDIR}/profile.json`;
    const configValid = ConfigParser.validateConfig();

    
    // Check if the profile is present
    if(configValid){
        const analysisOptions: AnalysisOptions | undefined = ConfigParser.getAnalysisOptions();

        if(analysisOptions !== undefined){
            const APPPATH = SETTINGS.getAPPPATH();
            const LOOPBOUND = analysisOptions?.loopbound;
            const STRATEGY = strategyToString(analysisOptions?.strategy);

            if(fs.existsSync(profilepath) ){
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
                            let instructionCommand = `${APPPATH} analyze --profile ${profilepath} --mode instruction --format json --strategy ${STRATEGY} --loopbound ${LOOPBOUND} --withCalls --program ${PROJECTDIR}/compiled/compilation_unit.ll > ${PROJECTDIR}/analysis.json`;
                            
                            try{
                                await exec(instructionCommand);
    
                                vscode.window.showInformationMessage(`Analysis executed successfully!`);
                                vscode.commands.executeCommand("spear-viewer.analysisresult.refreshEntry");
                                vscode.commands.executeCommand("spearsidebar.analysisresult.focus");
                                vscode.commands.executeCommand("spear-viewer.callgraph.refreshEntry");
                            }catch(e){
                                console.error(e);
                                Logger.log(LogType.ERROR, `Analysis error: ${e}`);
                                vscode.window.showErrorMessage(`The analysis could not be generated! See the Error-Log for further information`);
                            }
    
                        }else{
                            vscode.window.showErrorMessage(`Converting of compilation unit to LLVM IR failed! Reason: ${bcError}`);
                        }
                    }else{
                        vscode.window.showErrorMessage(`Linking of configured files failed! See the Error-Log for further information`);
                    }
                }
            }else{
                vscode.window.showErrorMessage("No profile found!. Please profile the system first");
            }
        }else{
            Logger.log(LogType.ERROR, "Parsing of config failed. Could not get configuration for the analysis!");
        }
    }
}