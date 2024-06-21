import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIGPATH, PROJECTDIR } from '../extension';
import { ConfigParser } from '../helper/configParser';
import { getCallGraph, openAnalysisEditor } from '../subroutines/analyzeHandler';
import { CallGraphNode, Callgraph, FileFunctionMapping } from '../types/AnalysisTypes';

interface AnalysisConfigFileItem {
    name: string;
    path: string;
    functions: Array<AnalysisFunctionObject>
}

interface AnalysisFunctionObject {
    name: string;
    energy: number;
}

export class SpearSidebarCallgraphViewer implements vscode.TreeDataProvider<GeneralItem> {  
    callgraph: Callgraph;

    constructor(){
        vscode.commands.registerCommand('spearsidebar.callgraph.onItemClicked', item => this.onItemClick(item));
        this.callgraph = getCallGraph();
    }

    private _onDidChangeTreeData: vscode.EventEmitter<GeneralItem | undefined | null | void> = new vscode.EventEmitter<GeneralItem | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<GeneralItem | undefined | null | void> = this._onDidChangeTreeData.event;


    getTreeItem(element: GeneralItem): vscode.TreeItem {
        const newElement = element;
        //newElement.command = { command: 'spearsidebar.callgraph.onItemClicked', title : element.label, arguments: [element] };;
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
            return Promise.resolve(element.children);
        } else {
            if (this.fileExists(analysisconfig)) {
                return Promise.resolve(this.getAnalysisInformation(analysisconfig));
            } else {
                vscode.window.showInformationMessage('No analysis config found!');
                return Promise.resolve([new GeneralItem("No analysis config", "", vscode.TreeItemCollapsibleState.None, true, false)]);
            }
        }
    }

    private getAnalysisInformation(analysisConfigPath: string): Array<FunctionItem>{
        if(this.fileExists(analysisConfigPath)) {
            const mapping = getCallGraph();

/*             const toFileItem = (item: AnalysisConfigFileItem): FileItem => {
                return new FileItem(item.name, item.path, item.functions);
            }; */

            if(mapping !== undefined){
                /* return configFiles.map((key) => {
                    const filename = path.basename(key);
                    const functions = mapping[key];
                    let analysisFunctionObjects: Array<AnalysisFunctionObject> = [];
                    if(functions){
                        analysisFunctionObjects = functions.map((func) => {return  { name: func.name, energy: func.energy }; });
                    }
                    return toFileItem({ name: filename, path: key, functions: analysisFunctionObjects });
                }); */

                const mainNode: CallGraphNode = mapping["main"];

                if(mainNode !== undefined){
                    return [
                        new FunctionItem(mainNode, mainNode.energy, mapping, mainNode.calledFunctions, undefined, undefined)
                    ];
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
        this.callgraph = getCallGraph();
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
    super(label, vscode.TreeItemCollapsibleState.Expanded);

    this.canBeAnalyzed = canBeAnalyzed;

    if(isErrorMsg){
        this.description = "Please generate one first!";
    }else{
        this.description = description;
    }

    this.iconPath = {
        light: path.join(__filename, '..', '..', 'media', 'icons', 'light', 'function.svg'),
        dark: path.join(__filename, '..', '..', 'media', 'icons', 'dark', 'function.svg')
    };
  }
}

class FunctionItem extends GeneralItem {
  constructor(public readonly node: CallGraphNode, energy: number, callGraph: Callgraph, functions: Array<string>, parent?: string, grandParent?: string) {
    const energyString = `${energy.toFixed(3)} J in`;
    const isRecursion = (node.name === parent && node.name === grandParent);
    const hasChildren = !isRecursion && (functions.length > 0);

    let name = `${node.demangled}`;
    if(isRecursion){
        name += "(rec)";
    }

    super(name, energyString, hasChildren? vscode.TreeItemCollapsibleState.Expanded: vscode.TreeItemCollapsibleState.None, false, true);

    this.tooltip = `${node.path}`;

    const objs: Array<GeneralItem> = [];
    if(!isRecursion || parent === undefined){
        functions.forEach((func: string) => {
            const callGraphNode: CallGraphNode = callGraph[func];
            if(callGraphNode !== undefined){
                objs.push(new FunctionItem(callGraphNode, callGraphNode.energy, callGraph, callGraphNode.calledFunctions, node.name, parent));
            }
        });
    }
    this.children = objs;
  }
}