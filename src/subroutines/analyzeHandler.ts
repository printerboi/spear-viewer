import * as vscode from "vscode";

export default async function analyzeHandler() {
    let activeEditor = vscode.window.activeTextEditor;
    console.log("launching...");
    console.log(activeEditor);
    if(activeEditor){
        const fileDocument = activeEditor.document;

        const uri = vscode.Uri.parse(`spearenergy://${fileDocument.fileName}`);
        const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        await vscode.window.showTextDocument(doc, { preview: true });
    }
}