import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIGPATH, PROJECTDIR } from '../extension';
import { ConfigParser } from '../helper/configParser';
import { getFunctionsPerFile, openAnalysisEditor } from '../subroutines/analyzeHandler';
import { FileFunctionMapping } from '../types/AnalysisTypes';

interface AnalysisConfigFileItem {
    name: string;
    path: string;
    functions: Array<AnalysisFunctionObject>
}

interface AnalysisFunctionObject {
    name: string;
    energy: number;
}

export class SpearSidebarAnalysisFilesViewer implements vscode.TreeDataProvider<GeneralItem> {  
    fileFunctionMapping: FileFunctionMapping;

    constructor(){
        vscode.commands.registerCommand('spearsidebar.anaylsis.onItemClicked', item => this.onItemClick(item));
        this.fileFunctionMapping = getFunctionsPerFile();
    }

    private _onDidChangeTreeData: vscode.EventEmitter<GeneralItem | undefined | null | void> = new vscode.EventEmitter<GeneralItem | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<GeneralItem | undefined | null | void> = this._onDidChangeTreeData.event;


    getTreeItem(element: GeneralItem): vscode.TreeItem {
        const newElement = element;
        newElement.command = { command: 'spearsidebar.anaylsis.onItemClicked', title : element.label, arguments: [element] };;
        return newElement;
    }

    getChildren(element: GeneralItem | undefined): vscode.ProviderResult<Array<GeneralItem>> {
        const analysisconfig = CONFIGPATH;

        console.log(analysisconfig);

        if (!this.fileExists(analysisconfig)) {
            vscode.window.showInformationMessage('No analysis configuration found!');
            return Promise.resolve([]);
        }

        if (element) {
            //return Promise.resolve(element.children);
        } else {
            if (this.fileExists(analysisconfig)) {
                return Promise.resolve(this.getAnalysisInformation(analysisconfig));
            } else {
                vscode.window.showInformationMessage('No analysis config found!');
                return Promise.resolve([new GeneralItem("No analysis config", "", vscode.TreeItemCollapsibleState.None, true, false)]);
            }
        }
    }

    private getAnalysisInformation(analysisConfigPath: string): Array<FileItem>{
        if(this.fileExists(analysisConfigPath)) {
            const mapping = getFunctionsPerFile();

            const toFileItem = (item: AnalysisConfigFileItem): FileItem => {
                return new FileItem(item.name, item.path, item.functions);
            };

            if(ConfigParser.validateConfig()){
                const configFiles = ConfigParser.getFiles();
                
                if(configFiles){
                    return configFiles.map((key) => {
                        const filename = path.basename(key);
                        const functions = mapping[key];
                        let analysisFunctionObjects: Array<AnalysisFunctionObject> = [];
                        if(functions){
                            analysisFunctionObjects = functions.map((func) => {return  { name: func.name, energy: func.energy }; });
                        }
                        return toFileItem({ name: filename, path: key, functions: analysisFunctionObjects });
                    });
                }else{
                    return [];
                }
            }else{
                return [];
            }
        }else{
            return [];
        }
    }

    refresh(): void {
        console.log("refreshing...");
        this.fileFunctionMapping = getFunctionsPerFile();
        this._onDidChangeTreeData.fire();
    }

    private fileExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
        return false;
        }
        return true;
    }

    public onItemClick(item: GeneralItem): void{
        console.log(`Clicked Item ${item.description}`);

        if(item.canBeAnalyzed){
            openAnalysisEditor(item.description as string);
        }
    }
}

class GeneralItem extends vscode.TreeItem {
  children: GeneralItem[]|undefined;
  canBeAnalyzed: boolean;

  constructor(public readonly label: string, description: string,  public readonly collapsibleState: vscode.TreeItemCollapsibleState, isErrorMsg: boolean, canBeAnalyzed: boolean) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.canBeAnalyzed = canBeAnalyzed;

    if(isErrorMsg){
        this.description = "Please generate one first!";
    }else{
        this.description = description;
    }

    this.iconPath = {
        light: path.join(__filename, '..', '..', 'media', 'icons', 'light', 'file-code.svg'),
        dark: path.join(__filename, '..', '..', 'media', 'icons', 'dark', 'file-code.svg')
    };
  }
}

class FunctionItem extends GeneralItem {
    constructor(public readonly label: string, private energy: string) {
        super(label, energy, vscode.TreeItemCollapsibleState.None, false, false);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'media', 'icons', 'light', 'function.svg'),
            dark: path.join(__filename, '..', '..', 'media', 'icons', 'dark', 'function.svg')
        };
    }
}

class FileItem extends GeneralItem {
  constructor(public readonly label: string, private path: string, functions: Array<AnalysisFunctionObject>) {
    super(label, path, vscode.TreeItemCollapsibleState.None, false, true);

    const objs: Array<GeneralItem> = [];
    functions.forEach((func) => {
        const energy = `${func.energy.toFixed(3)} J`;
        objs.push(new FunctionItem(func.name, energy));
    });
    this.children = objs;
  }
}