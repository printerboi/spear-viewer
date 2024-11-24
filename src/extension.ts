import * as vscode from 'vscode';
import * as fs from 'fs';
import generateGraph, { GenerateGraphParameters } from './subroutines/generateGraph';
import profile from './subroutines/profile';
import { triggerDecorationUpdate } from './subroutines/decorationHandler';
import analyzeHandler from './subroutines/analyzeHandler';
import { energyEditorProvider } from './editors/virtualEnergyEditor';
import { SpearSidebarAnalysisFilesViewer } from './sidebar/SpearSidebarAnalysisFilesViewer';
import { SpearSidebarProfileProvider } from './sidebar/SpearSidebarProfileView';
import { StatusbarRunButton } from './statusbar/StatusbarRunButton';
import { ConfigParser } from './helper/configParser';
import { SpearSidebarCallgraphViewer } from './sidebar/SpearSidebarCallgraphViewer';


// Init application wide path variables
export let PROJECTDIR: string = "";
export let CONFIGPATH: string = "";
export let CONFIGLOCATION: string = "";
export let EXTENSIONLOCATION: string = "";
export let initialized: boolean = false;

/**
 * Init the UI components visible in the SPEAR tab
 */
export const ProfileProvider = new SpearSidebarProfileProvider();
export const OverviewProvider = new SpearSidebarAnalysisFilesViewer();
export const CallgraphProvider = new SpearSidebarCallgraphViewer();


/**
 * Activation function to run on the activation of the extension
 * Will also run if a new folder will be open
 * @param context VSC context
 */
export function activate(context: vscode.ExtensionContext) {
	try {
		console.log('SPEAR-viewer active!');

		let activeEditor = vscode.window.activeTextEditor;

		// Define paths
		if(vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0){
			CONFIGPATH = `${vscode.workspace.workspaceFolders[0].uri.fsPath}/spear.yml`;
			PROJECTDIR = `${vscode.workspace.workspaceFolders[0].uri.fsPath}/.spear`;
			CONFIGLOCATION = `${vscode.workspace.workspaceFolders[0].uri.fsPath}`;
			EXTENSIONLOCATION = `${context.extensionPath}`;

			initialized = true;
			OverviewProvider.refresh();
		}
		
		
		// Check if the current workspace includes a SPEAR-Viewer config. If not, present a dialog.
		if(!fs.existsSync(CONFIGPATH)){
			ConfigParser.presentConfigCreationDialog();
		}
		
		context.subscriptions.push(
			/**
			 * Command to generate the graph for the currently open editor
			 */
			vscode.commands.registerCommand('spear-viewer.graph', async (params: GenerateGraphParameters) => {
				generateGraph(params);
			}),
			

			/**
			 * Profiles the device and saves the generated profile in the tempory directory of the application
			 */
			vscode.commands.registerCommand('spear-viewer.profile', async () => {
				profile();
			}),

			/**
			 * Starts the analysis
			 */
			vscode.commands.registerCommand('spear-viewer.analyze', async () => {
				analyzeHandler();
			}),

			/**
			 * Registers a tree view for displaying analysed files
			 */
			vscode.window.registerTreeDataProvider("spearsidebar.analysisresult", OverviewProvider),

			/**
			 * Registers a tree view for displaying the energy call graph
			 */
			vscode.window.registerTreeDataProvider("spearsidebar.callgraph", CallgraphProvider),

			/**
			 * Registers a tree view for displaying profile information
			 */
			vscode.window.registerTreeDataProvider("spearsidebar.profile", ProfileProvider),

			/**
			 * Registers a command to allow for refreshment of profile information
			 */
			vscode.commands.registerCommand('spear-viewer.profile.refreshEntry', () =>
				ProfileProvider.refresh()
			),

			/**
			 * Registers a command to allow for refreshing the analysis result
			 */
			vscode.commands.registerCommand('spear-viewer.analysisresult.refreshEntry', () =>
				OverviewProvider.refresh()
			),

			/** 
			 * Registers a command to allow for refreshing the energy callgraph
			 */
			vscode.commands.registerCommand('spear-viewer.callgraph.refreshEntry', () =>
				CallgraphProvider.refresh()
			),

			/**
			 * Register a readonly editor to display code with energy highlightings
			 */
			vscode.workspace.registerTextDocumentContentProvider("spearenergy", energyEditorProvider),

			/**
			 * Registers a button that enables users to run the analysis from the status bar
			 */
			StatusbarRunButton.get()
		);

		// Update the analysis button in the status bar
		StatusbarRunButton.update();

		if (activeEditor) {
			triggerDecorationUpdate(true, activeEditor, context);
		}

		/**
		 * Adds a text editor change listener to update the visible decorations if the user
		 * opens a energy read only editor
		 */
		vscode.window.onDidChangeActiveTextEditor(editor => {
			activeEditor = editor;
			if (editor) {
				triggerDecorationUpdate(false, activeEditor, context);
			}
			StatusbarRunButton.update();
		}, null, context.subscriptions);
	

		/**
		 * Adds a text editor change listener to update the visible decorations if the user
		 * switches a energy read only editor
		 */
		vscode.workspace.onDidChangeTextDocument(event => {
			if (activeEditor && event.document === activeEditor.document) {
				triggerDecorationUpdate(true, activeEditor, context);
			}

			StatusbarRunButton.update();
		}, null, context.subscriptions);
	}catch(e){
		// Catch any error encoutered during the activation
		console.error(e);
		vscode.window.showErrorMessage('Error activating the SPEAR-Viewer. A temporary directory could not be created!');
	}

	
}

/**
 * Deactivation function
 */
export function deactivate() {}
