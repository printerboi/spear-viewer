/**
 * Defines the StatusbarRunButton that launches the analysis from the status bar
 * Author: Maximilian Krebs
 */

import * as vscode from 'vscode';

export let runButtonObject: vscode.StatusBarItem | undefined = undefined;

/**
 * UI component class to execute the analysis by pressing a button
 */
export class StatusbarRunButton {
    constructor(){}

    /**
     * Construct the status bar item
     * @returns 
     */
    public static get(): vscode.StatusBarItem{
        const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
        statusItem.command = 'spear-viewer.analyze';
        statusItem.text = `$(spear-logo)   SPEAR analysis`;

        runButtonObject = statusItem;

        return statusItem;
    } 

    /**
     * Update the icon
     */
    public static update(): void {
        if(runButtonObject){
            runButtonObject.show();
        }
    }
}