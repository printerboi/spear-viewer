import { error } from "console";
import * as vscode from "vscode";

/**
 * Provides a virtual TextEditor for the spearenergyscheme
 */
export const energyEditorProvider = new (class implements vscode.TextDocumentContentProvider {
    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        // Get the path of the provided uri
        const pathuri = vscode.Uri.parse(uri.path);
        // Ask for the pointed document
        const doc = await vscode.workspace.openTextDocument(pathuri);
        // Get the text of the document
        const text = doc.getText();

        // Simply return the text, as we only want to display it as .cpp file
        // The highlighting of the code will be done by using decorations
        return text;
    }
  })();