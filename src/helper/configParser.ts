import YAML, { YAMLSeq } from 'yaml';
import { CONFIGLOCATION, CONFIGPATH } from '../extension';
import * as fs from 'fs';
import path from 'path';
import * as vscode from 'vscode';

interface Config{
    version: string,
    name: string,
    files: YAMLSeq<string>;
}

export class ConfigParser{
    static parseConfig(): Config {
        const fileContent = fs.readFileSync(CONFIGPATH);
        const parsedFileContent = YAML.parseDocument(fileContent.toString());

        const configObj: Config = {
            version: parsedFileContent.get("version") as string,
            name: parsedFileContent.get("name") as string,
            files: parsedFileContent.get("files") as YAMLSeq<string>
        };

        console.log(configObj);
        return configObj;
    }

    static getFiles(): Array<string> {
        const config = this.parseConfig();

        return config.files.items.map((fileName: string) => { 
            const filePath = `${CONFIGLOCATION}/${fileName}`;
            return filePath;
        });
    }

    static validateConfig(): boolean {
        console.log(CONFIGLOCATION, CONFIGPATH);
        if(CONFIGLOCATION && CONFIGPATH){
            const config: Config = this.parseConfig();
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
                        return true;
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

        return false;
    }
}