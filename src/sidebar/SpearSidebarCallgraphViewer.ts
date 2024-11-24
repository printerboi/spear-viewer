/**
 * Defines the UI component for the energy callgraph
 * Author: Maximilian Krebs
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIGPATH } from '../extension';
import { getCallGraph, openAnalysisEditor } from '../subroutines/analyzeHandler';
import { CallGraphNode, Callgraph } from '../types/AnalysisTypes';


/**
 * Defines the UI component
 */
export class SpearSidebarCallgraphViewer implements vscode.TreeDataProvider<GeneralItem> {  
    callgraph: Callgraph;

    /**
     * Construct the callgraph view
     */
    constructor(){
        vscode.commands.registerCommand('spearsidebar.callgraph.onItemClicked', item => this.onItemClick(item));
        this.callgraph = getCallGraph();
    }

    // Handle changes
    private _onDidChangeTreeData: vscode.EventEmitter<GeneralItem | undefined | null | void> = new vscode.EventEmitter<GeneralItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<GeneralItem | undefined | null | void> = this._onDidChangeTreeData.event;

    /**
     * Construct a callgraph item
     * @param element Element that should construct the callgraph item
     * @returns constructed TreeItem for the callgraph
     */
    getTreeItem(element: GeneralItem): vscode.TreeItem {
        const newElement = element;
        return newElement;
    }

    /**
     * Construct the TreeView items displayed as children for a given TreeItem
     * @param element Item that we want to construct the children for
     * @returns Array of children
     */
    getChildren(element: GeneralItem | undefined): vscode.ProviderResult<Array<GeneralItem>> {
        const analysisconfig = CONFIGPATH;

        // Check if config exists
        if (!this.fileExists(analysisconfig)) {
            vscode.window.showInformationMessage('No analysis configuration found!');
            return Promise.resolve([]);
        }

        // Check if the given element is undefined. If so we construct a new element. If not we construct the children
        if (element) {
            return Promise.resolve(element.children);
        } else {
            // Check if the analysis config exists
            if (this.fileExists(analysisconfig)) {
                // This part will only be called if the encouter the root element
                return Promise.resolve(this.getAnalysisInformation(analysisconfig));
            } else {
                vscode.window.showInformationMessage('No analysis config found!');
                return Promise.resolve([new GeneralItem("No analysis config", "", vscode.TreeItemCollapsibleState.None, true, false)]);
            }
        }
    }

    /**
     * Get the information from the analysis config
     * @param analysisConfigPath 
     * @returns Array of functionitems to be displayed in the tree view
     */
    private getAnalysisInformation(analysisConfigPath: string): Array<FunctionItem>{
        if(this.fileExists(analysisConfigPath)) {
            // Construct the actual callgraph
            const mapping = getCallGraph();

            // Check if the construction of the callgraph was successfull
            if(mapping !== undefined){
                // Get the main function from the callgraph, as it will be the root of our tree view
                const mainNode: CallGraphNode = mapping["main"];

                if(mainNode !== undefined){
                    // Construct the function item for the main function
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

    /**
     * Refresh the callgraph view
     */
    refresh(): void {
        console.log("refreshing...");
        this.callgraph = getCallGraph();
        this._onDidChangeTreeData.fire();
    }

    /**
     * Check if a given file exists
     * @param p Path to the file
     * @returns True if the file exists, false otherwise
     */
    private fileExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
        return false;
        }
        return true;
    }

    /**
     * Handler to execute if a user clicks on a call graph function item
     * @param item Item that was clicked
     */
    public onItemClick(item: GeneralItem): void{
        if(item.canBeAnalyzed){
            // Open the analysiseditor
            openAnalysisEditor(item.description as string);
        }
    }
}

/**
 * General tree view item abstraction
 */
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

/**
 * Function item build ontop of the general item abstraction
 * Will resemble a function in the callgraph as tree item
 */
class FunctionItem extends GeneralItem {
    /**
     * Construct the tree item
     * @param node CallgraphNode that we want the tree item to be constructed
     * @param energy Energy used by the function encapsulated in the CallgraphNode
     * @param callGraph Callgraph the function belongs to
     * @param functions Array of sub functions
     * @param parent Parent Node
     * @param grandParent Grandparent Node to handle recursion
     */
    constructor(public readonly node: CallGraphNode, energy: number, callGraph: Callgraph, functions: Array<string>, parent?: string, grandParent?: string) {
        // Construct energy string with given energy
        const energyString = `${energy.toFixed(3)} J`;

        // Check for recursion. If name of parent function is the same as grandparents name, we encoutered a recursion
        // This check should be improved in the future
        const isRecursion = (node.name === parent && node.name === grandParent);

        // Check if the given node calls other functions
        const hasChildren = !isRecursion && (functions.length > 0);

        let name = `${node.demangled}`;

        // Mark recursive functions
        if(isRecursion){
            name += "(rec)";
        }

        // Construct a GeneralItem
        super(name, energyString, hasChildren? vscode.TreeItemCollapsibleState.Expanded: vscode.TreeItemCollapsibleState.None, false, true);
        // Denote the Node with a tooltip containing the path of the file the funtion is defined in
        this.tooltip = `${node.path}`;

        const objs: Array<GeneralItem> = [];
        // Construct the subnodes from the given sub functions array
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