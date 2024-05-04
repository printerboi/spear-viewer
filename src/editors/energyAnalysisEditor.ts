import * as vscode from "vscode";


export class EnergyAnalysisEditorProvider implements vscode.CustomTextEditorProvider {
    private static viewType = "spear.energyAnalysis";

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new EnergyAnalysisEditorProvider(context);
        const registration = vscode.window.registerCustomEditorProvider(EnergyAnalysisEditorProvider.viewType, provider);
        return registration;
    }

    constructor(private readonly context: vscode.ExtensionContext) { 
        // Empty constructor...
    }

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {

    }


}