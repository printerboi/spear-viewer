/**
 * Config parser file to enable interaction with the SPEAR-Viewer config
 * Author: Maximilian Krebs
 * 
 */

import YAML, { YAMLMap, YAMLSeq } from 'yaml';
import { CONFIGLOCATION, CONFIGPATH, EXTENSIONLOCATION, PROJECTDIR, initialized } from '../extension';
import * as fs from 'fs';
import path from 'path';
import * as vscode from 'vscode';
import { LogType, Logger } from './logger';

/**
 * Strategy enum
 */
enum Strategy {
    worst,
    average,
    best,
    undefined
}

/**
 * Interface to deal with the options expected for the analysis
 */
export interface AnalysisOptions {
    loopbound: number,
    strategy: Strategy,
    threshold: number
}

/**
 * Interface to deal with the options expected for the profiling
 */
export interface ProfileOptions {
    iterations: number,
}

/**
 * Config interface combining all options
 */
export interface Config {
    version: string,
    name: string,
    files: YAMLSeq<string>;
    analysis: AnalysisOptions;
    profile: ProfileOptions;
}

/**
 * Converts a given input string into an element from the Strategy interface
 * @param input Inputstring
 * @returns A Strategy enum item
 */
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

/**
 * Converts a given Strategy enum item to a string
 * @param input Strategy enum item
 * @returns Strategy string
 */
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

/**
 * ConfigParser class to parse a given config and provide it to the extension
 */
export class ConfigParser{

    /**
     * Config parser function to parse a SPEAR-Viewer config file present under the given path
     * @returns A parsed Config object if valid, undefined otherwise
     */
    static parseConfig(): Config | undefined {
        // Try parsing
        try{
            // Read the config and parse it as YAML code
            const fileContent = fs.readFileSync(CONFIGPATH);
            const parsedFileContent = YAML.parseDocument(fileContent.toString());

            const analysis = parsedFileContent.get("analysis") as YAMLMap;
            const profiling = parsedFileContent.get("profiling") as YAMLMap;

            // Construct the Config object by deconstructing the parsed yaml
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

            return configObj;
        }catch(e){
            // Provide users with information about the failed parsing
            Logger.log(LogType.ERROR, `Your spear.yml is invalid! Reason: ${e}`);
            vscode.window.showErrorMessage("Configuration invalid!");
            return undefined;
        }
    }

    /**
     * Gets an array of file paths from the config
     * @returns Array containing file paths to the analysis relevant file
     */
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

    /**
     * Returns the analysis options of the config
     * @returns Analysis options of the extension config
     */
    static getAnalysisOptions(): AnalysisOptions | undefined{
        const config: Config | undefined = this.parseConfig();

        if(config !== undefined){
            return config.analysis;
        }else{
            return undefined;
        }
    }

    /**
     * Returns the profile options of the config
     * @returns Profile options of the extension config
     */
    static getProfileOptions(): ProfileOptions | undefined{
        const config: Config | undefined = this.parseConfig();

        if(config !== undefined){
            return config.profile;
        }else{
            return undefined;
        }
    }

    /**
     * Validate the options present in the parsed config
     * @returns true if config is valid, false otherwise
     */
    static validateConfig(): boolean {
        // Check if a config exits
        if(CONFIGLOCATION && CONFIGPATH){
            if(this.configExists()){
                // Parse the config
                const config: Config | undefined = this.parseConfig();
                if(config !== undefined){
                    // Validate that the version is correct
                    const versionValid = config.version === "1.0";
                
                    if(versionValid){
                        // Check that all analysis files defined in the config exist
                        const allFileExists = config.files.items.every((fileName: string) => {
                            const filePath = `${CONFIGLOCATION}/${fileName}`;
                            return fs.existsSync(filePath);
                        });

                        if(allFileExists){
                            // Check that the user did only define .cpp file
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

                                // Check validity of numerical config options
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

    /**
     * File to create a dialog used for the creation of the SPEAR-Viewer config file in the current workspace
     */
    static presentConfigCreationDialog(): void {
        // Check if extension is initialized
        if(initialized){
            vscode.window.showInformationMessage('No spear config file was provided. Please create one first!', "Create", "Later...")
            .then((value: any) => {
                // If the user opts for the creation of the config file create it
                
                if(value === "Create"){
                    const projectFileStream = fs.createWriteStream(CONFIGPATH);

                    // Copy the sample config
                    const sampleConfig = fs.readFileSync(`${EXTENSIONLOCATION}/util/sample.config.yml`);
                    projectFileStream.write(sampleConfig);
                    projectFileStream.end();
                    this.createSpearDir();
                    vscode.window.showInformationMessage("Spear config created!");
                }
            });
        }
    }

    /**
     * Create the .spear folder in the current workspace
     */
    static createSpearDir(){
        try{
            fs.mkdirSync(`${PROJECTDIR}`);
            Logger.log(LogType.DEBUG, "Created the project directory");
        }catch(e: any){
            Logger.log(LogType.ERROR, e);
            vscode.window.showErrorMessage("Could not create .spear directoy. Please check the write permissions to the current folder and try again!");
        }
    }

    /**
     * Check if a config exists under the given path
     * @returns true if the config exists, false otherwise
     */
    static configExists(): boolean{
        return fs.existsSync(CONFIGPATH);
    }

    /**
     * Check if a profile exists in the .spear folder
     * @returns true if the profile exists, false otherwise
     */
    static profileExists(): boolean{
        return fs.existsSync(`${PROJECTDIR}/profile.json`);
    }
}