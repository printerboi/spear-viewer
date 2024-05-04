import { error } from "console";
import * as vscode from "vscode";

export const energyEditorProvider = new (class implements vscode.TextDocumentContentProvider {
    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const pathuri = vscode.Uri.parse(uri.path);
        const doc = await vscode.workspace.openTextDocument(pathuri);
        const text = doc.getText();

        return text;
    }
  })();