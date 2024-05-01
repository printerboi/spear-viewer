// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from "os";
import { APPPREFIX } from './helper/extensionConstants';
import generateGraph from './subroutines/generateGraph';
import profile from './subroutines/profile';

export let TMPDIR: string = "";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("Creating tmp dir...");
	try {
		TMPDIR = fs.mkdtempSync(path.join(os.tmpdir(), APPPREFIX));
		
		// Use the console to output diagnostic information (console.log) and errors (console.error)
		// This line of code will only be executed once when your extension is activated
		console.log('Spear-viewer active!');

		
		context.subscriptions.push(
			/**
			 * Command to generate the graph for the currently open editor
			 */
			vscode.commands.registerCommand('spear-viewer.graph', async () => {
				generateGraph();
			}),

			/**
			 * Profiles the device and saves the generated profile in the tempory directory of the application
			 */
			vscode.commands.registerCommand('spear-viewer.profile', async () => {
				// [TODO]: Validate config here
				profile();
			})
		);
	}catch(e){
		console.error(e);
		vscode.window.showErrorMessage('Error activating spear. A temporary directory could not be created!');
	}

	
}

// This method is called when your extension is deactivated
export function deactivate() {
	try {
		if (TMPDIR) {
			fs.rmSync(TMPDIR, { recursive: true });
		}
	}
	catch (e) {
		vscode.window.showInformationMessage(`An error has occurred while removing the temporary directory at ${TMPDIR}. Please remove it manually. Error: ${e}`);
	}
}
