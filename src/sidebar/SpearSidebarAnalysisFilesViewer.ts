/**
 * Defines a UI component that allows for the interaction of the user with the analysed files
 * Author: Maximilian Krebs
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIGPATH, PROJECTDIR } from '../extension';
import { ConfigParser } from '../helper/configParser';
import { getFunctionsPerFile, openAnalysisEditor } from '../subroutines/analyzeHandler';
import { FileFunctionMapping } from '../types/AnalysisTypes';

/**
 * Intreface to define a single file under analysis
 */
interface AnalysisConfigFileItem {
    name: string;
    path: string;
    functions: Array<AnalysisFunctionObject>
}

/**
 * Defines a function under analysis
 */
interface AnalysisFunctionObject {
    name: string;
    energy: number;
}

/**
 * Define a class that implements the TreeView for the analysis files
 * 
 */
export class SpearSidebarAnalysisFilesViewer implements vscode.TreeDataProvider<GeneralItem> { 
    // Stores the mapping of functions to files 
    fileFunctionMapping: FileFunctionMapping;

    /**
     * Construct the TreeDataProvider
     */
    constructor(){
        // Register the calling of the click function if someone clicks on a item in the TreeView
        vscode.commands.registerCommand('spearsidebar.anaylsis.onItemClicked', item => this.onItemClick(item));
        // Calculate the functions for the files
        this.fileFunctionMapping = getFunctionsPerFile();
    }

    /**
     * Handler to be called if the TreeData changes
     */
    private _onDidChangeTreeData: vscode.EventEmitter<GeneralItem | undefined | null | void> = new vscode.EventEmitter<GeneralItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<GeneralItem | undefined | null | void> = this._onDidChangeTreeData.event;

    /**
     * Construct a new TreeItem
     * @param element GeneralItem element to be inserted into the TreeView
     * @returns The constructed TreeItem
     */
    getTreeItem(element: GeneralItem): vscode.TreeItem {
        const newElement = element;
        newElement.command = { command: 'spearsidebar.anaylsis.onItemClicked', title : element.label, arguments: [element] };;
        return newElement;
    }

    /**
     * Contructs the TreeItems of the TreeView
     * @param element TreeView we want to construct the TreeViewItems for
     * @returns Array of TreeItems containing analysis files
     */
    getChildren(element: GeneralItem | undefined): vscode.ProviderResult<Array<GeneralItem>> {
        const analysisconfig = CONFIGPATH;

        // Check if the analysis config exists
        if (!this.fileExists(analysisconfig)) {
            vscode.window.showInformationMessage('No analysis configuration found!');
            return Promise.resolve([]);
        }

        // Check if the given Item exists. If so, this function is called to calculate the childrens of the item
        // As we are not displaying hirachical information here, this is not needed
        if (element) {
            //return Promise.resolve(element.children);
        } else {
            // If the item does not exist, calculate the analysis for the items
            if (this.fileExists(analysisconfig)) {
                return Promise.resolve(this.getAnalysisInformation(analysisconfig));
            } else {
                vscode.window.showInformationMessage('No analysis config found!');
                return Promise.resolve([new GeneralItem("No analysis config", "", vscode.TreeItemCollapsibleState.None, true, false)]);
            }
        }
    }

    /**
     * Parse a calculated analysis
     * @param analysisConfigPath Path of the analysis config
     * @returns An array containing files under analysis
     */
    private getAnalysisInformation(analysisConfigPath: string): Array<FileItem>{
        // Check if the analysis result exists
        if(this.fileExists(analysisConfigPath)) {
            // Get the functions per file
            const mapping = getFunctionsPerFile();

            // Helper function to convert a analysis file to a displayable TreeItem
            const toFileItem = (item: AnalysisConfigFileItem): FileItem => {
                return new FileItem(item.name, item.path, item.functions);
            };

            // Validate config
            if(ConfigParser.validateConfig()){
                // Parse files under analysis
                const configFiles = ConfigParser.getFiles();
                
                if(configFiles){
                    // Map the files under analysis to the TreeViewItems
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

    /**
     * Refresh the TreeView
     */
    refresh(): void {
        console.log("refreshing...");
        this.fileFunctionMapping = getFunctionsPerFile();
        this._onDidChangeTreeData.fire();
    }

    /**
     * Check if a file under analysis exists
     * @param p Path to the file
     * @returns true if file exists, false otherwise
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
     * Handler to be executed if the TreeItem is clicked
     * @param item Item that was clicked
     */
    public onItemClick(item: GeneralItem): void{
        // Check if the item can be analyzed
        if(item.canBeAnalyzed){
            // Open the read only analysis editor
            openAnalysisEditor(item.description as string);
        }
    }
}

/**
 * GeneralItem class resembling a file under analysis
 */
class GeneralItem extends vscode.TreeItem {
  children: GeneralItem[]|undefined;
  canBeAnalyzed: boolean;

  /**
   * Construct the item
   * @param label Item label
   * @param description detailed description
   * @param collapsibleState Is the item collapsed
   * @param isErrorMsg Error message
   * @param canBeAnalyzed Can the item be analyzed?
   */
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

/**
 * FunctionItem to store function information
 */
class FunctionItem extends GeneralItem {
    constructor(public readonly label: string, private energy: string) {
        super(label, energy, vscode.TreeItemCollapsibleState.None, false, false);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'media', 'icons', 'light', 'function.svg'),
            dark: path.join(__filename, '..', '..', 'media', 'icons', 'dark', 'function.svg')
        };
    }
}

/**
 * FileItem to store file information and store functions
 */
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