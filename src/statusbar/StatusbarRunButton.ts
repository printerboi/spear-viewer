import * as vscode from 'vscode';

export let runButtonObject: vscode.StatusBarItem | undefined = undefined;

export class StatusbarRunButton {
    constructor(){}

    public static get(): vscode.StatusBarItem{
        const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
        statusItem.command = 'spear-viewer.analyze';
        statusItem.text = `$(spear-logo)   SPEAR analysis`;

        runButtonObject = statusItem;

        return statusItem;
    } 

    public static update(): void {
        if(runButtonObject){
            runButtonObject.show();
        }
    }
}