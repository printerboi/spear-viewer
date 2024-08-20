import YAML, { YAMLMap, YAMLSeq } from 'yaml';
import { CONFIGLOCATION, CONFIGPATH, EXTENSIONLOCATION, PROJECTDIR, initialized } from '../extension';
import * as fs from 'fs';
import path from 'path';
import * as vscode from 'vscode';
import { LogType, Logger } from './logger';

enum Strategy {
    worst,
    average,
    best,
    undefined
}

export interface AnalysisOptions {
    loopbound: number,
    strategy: Strategy,
    threshold: number
}

export interface ProfileOptions {
    iterations: number,
}

export interface Config {
    version: string,
    name: string,
    files: YAMLSeq<string>;
    analysis: AnalysisOptions;
    profile: ProfileOptions;
}

function stringToStrategy(input: string): Strategy{
    switch(input){
        case "best":
            return Strategy.best;
        case "average":
            return Strategy.average;
        case "worst":
            return Strategy.worst;
        default:
            return Strategy.undefined;
    }
}

export function strategyToString(input: Strategy): string{
    switch(input){
        case Strategy.best:
            return 'best';
        case Strategy.average:
            return 'average';
        case Strategy.worst:
            return 'worst';
        default:
            return "UNDEFINED";
    }
}

export class ConfigParser{
    static parseConfig(): Config | undefined {
        try{
            const fileContent = fs.readFileSync(CONFIGPATH);
            const parsedFileContent = YAML.parseDocument(fileContent.toString());

            const analysis = parsedFileContent.get("analysis") as YAMLMap;
            const profiling = parsedFileContent.get("profiling") as YAMLMap;

            const configObj: Config = {
                version: parsedFileContent.get("version") as string,
                name: parsedFileContent.get("name") as string,
                files: parsedFileContent.get("files") as YAMLSeq<string>,
                analysis: {
                    loopbound: analysis.get("loopbound") as number,
                    strategy: stringToStrategy(analysis.get("strategy") as string),
                    threshold: analysis.get("threshold") as number,
                },
                profile: {
                    iterations: profiling.get("iterations") as number,
                }
            };

            console.log(configObj);
            return configObj;
        }catch(e){
            Logger.log(LogType.ERROR, `Your spear.yml is invalid! Reason: ${e}`);
            vscode.window.showErrorMessage("Configuration invalid!");
            return undefined;
        }
    }

    static getFiles(): Array<string> {
        const config: Config | undefined = this.parseConfig();

        if(config !== undefined){
            return config.files.items.map((fileName: string) => { 
                const filePath = `${CONFIGLOCATION}/${fileName}`;
                return filePath;
            });
        }else{
            return [];
        }
    }

    static getAnalysisOptions(): AnalysisOptions | undefined{
        const config: Config | undefined = this.parseConfig();

        if(config !== undefined){
            return config.analysis;
        }else{
            return undefined;
        }
    }

    static getProfileOptions(): ProfileOptions | undefined{
        const config: Config | undefined = this.parseConfig();

        if(config !== undefined){
            return config.profile;
        }else{
            return undefined;
        }
    }

    static validateConfig(): boolean {
        if(CONFIGLOCATION && CONFIGPATH){
            if(this.configExists()){
                const config: Config | undefined = this.parseConfig();
                if(config !== undefined){
                    const versionValid = config.version === "1.0";
                
                    if(versionValid){
                        const allFileExists = config.files.items.every((fileName: string) => {
                            const filePath = `${CONFIGLOCATION}/${fileName}`;
                            return fs.existsSync(filePath);
                        });

                        if(allFileExists){
                            const allFilesCpp = config.files.items.every((fileName: string) => {
                                const filePath = `${CONFIGLOCATION}/${fileName}`;
                                const extension = path.extname(filePath);
                                return extension === ".cpp";
                            });

                            if(allFilesCpp){

                                //If all files exist add the .spear folder to the current directory
                                if(!fs.existsSync(`${PROJECTDIR}`)){
                                    this.createSpearDir();
                                }

                                if(config.analysis.loopbound >= 0 && Number.isInteger(config.analysis.loopbound)){
                                    if(config.profile.iterations >= 0 && Number.isInteger(config.profile.iterations)){
                                        if(config.analysis.strategy !== Strategy.undefined){
                                            if(config.analysis.threshold >= 0){
                                                return true;
                                            }else{
                                                vscode.window.showErrorMessage("Configuration invalid! threashold should be a positive real number");
                                            }
                                        }else{
                                            vscode.window.showErrorMessage("Configuration invalid! strategy should be one of the following keywords worst/average/best");
                                        }
                                    }else{
                                        vscode.window.showErrorMessage("Configuration invalid! iterations should be a natural number");
                                    }
                                }else{
                                    vscode.window.showErrorMessage("Configuration invalid! loopbound should be a natural number");
                                }
                            }else{
                                vscode.window.showErrorMessage("Configuration invalid! Please only add .cpp files to the configuration!");
                            }
                        }else{
                            vscode.window.showErrorMessage("Configuration invalid! Some files could not be found!");
                        }
                    }else{
                        vscode.window.showErrorMessage("Configuration invalid! Version must be 1.0");
                    }
                }
            }else{
                this.presentConfigCreationDialog();
            }
        }

        return false;
    }

    static presentConfigCreationDialog(): void {
        if(initialized){
            vscode.window.showInformationMessage('No spear config file was provided. Please create one first!', "Create", "Later...")
            .then((value: any) => {
                console.log(value);
                if(value === "Create"){
                    const projectFileStream = fs.createWriteStream(CONFIGPATH);

                    const sampleConfig = fs.readFileSync(`${EXTENSIONLOCATION}/util/sample.config.yml`);
                    projectFileStream.write(sampleConfig);
                    projectFileStream.end();
                    this.createSpearDir();
                    vscode.window.showInformationMessage("Spear config created!");
                }
            });
        }
    }

    static createSpearDir(){
        try{
            fs.mkdirSync(`${PROJECTDIR}`);
            Logger.log(LogType.DEBUG, "Created the project directory");
        }catch(e: any){
            Logger.log(LogType.ERROR, e);
            vscode.window.showErrorMessage("Could not create .spear directoy. Please check the write permissions to the current folder and try again!");
        }
    }

    static configExists(): boolean{
        return fs.existsSync(CONFIGPATH);
    }

    static profileExists(): boolean{
        return fs.existsSync(`${PROJECTDIR}/profile.json`);
    }
}