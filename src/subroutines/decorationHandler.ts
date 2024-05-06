import * as vscode from 'vscode';
import { graphDecorationType } from '../decorations/graphDecoration';
import { AnalysisDecorationWrapper, AnalysisResult } from '../decorations/energyDecoration';
import qs from 'querystring';

export let timeout: ReturnType<typeof setTimeout> | undefined = undefined;


/**
 * Updates the decorations for the given vscode TextEditor
 * @param activeEditor TextEditor the decorations should be updated for
 */
export async function updateDecorations(activeEditor: vscode.TextEditor | undefined) {
    // Check if the given editor is valid, return otherwise
    if(!activeEditor){
        return;
    }

    // Calculate the symbols of the open document
    // This yields the function definitions in the current file
    const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', activeEditor.document.uri);

    // Check thath the currently open document uses the spearenergy uri scheme
    if(activeEditor.document.uri.scheme === "spearenergy"){
        // Get the query of the provided uri
        const query = activeEditor.document.uri.query;
        // Parse the query params to get the analysisresult for the document
        const jsUrlparams = qs.parse(query);

        // Check that the query params contain an analysisresult
        if(jsUrlparams && jsUrlparams.analysisresult){
            const analysisResult = jsUrlparams.analysisresult as string;
            // Parse the query string as JSON
            try{
                const energyJson: AnalysisResult = JSON.parse(analysisResult);

                // If the parsing worked
                if(energyJson){
                    // Construct the AnalysisDecorationWrapper with the energyjson and the path of the currently open file
                    const decWrapper = new AnalysisDecorationWrapper(energyJson, activeEditor.document.fileName);

                    // Iterate over the lines of the document
                    for(let i = 0; i < activeEditor.document.lineCount; i++){
                        // Construct a decoration for this line
                        const decoration = { range: new vscode.Range(i, 0, i, 0) };

                        // Activate the decoration and get the RenderOptions with the wrapper
                        activeEditor.setDecorations(vscode.window.createTextEditorDecorationType(decWrapper.getDecoration(i)), [decoration]);
                    }
                }
            }catch(e){
                console.error("Analysis could not be parsed")
            }
        }
    }

    if(symbols){
        const information = symbols as vscode.SymbolInformation[];

        const functionDefinitions: vscode.DecorationOptions[] = [];

        information.forEach((symbol) => {
            // The vscode CPP symbol analysis yields function names followed by their parameterlist
            // We have to extract the name from the yielded string
            // The following regex returns all chars before the first '('
            // Hope for the best that this catches most cases of function name declarations...
            const parsed = symbol.name.match(/^[^(]+/);
            const parsedName = parsed? parsed[0]: null;

            if(parsedName){
                const graphCommandUri = vscode.Uri.parse(`command:spear-viewer.graph?${encodeURIComponent(JSON.stringify({ functionname: parsedName }))}`);

                const hoverMessage = new vscode.MarkdownString(`[📈 Show energy graph](${graphCommandUri}) **|** [⚡ Calculate energy usage](#)`);
                hoverMessage.isTrusted = true;

                const decoration = { range: new vscode.Range(symbol.location.range.start, new vscode.Position(symbol.location.range.start.line, 10)), hoverMessage: hoverMessage };
                functionDefinitions.push(decoration);
            }
        });

        activeEditor.setDecorations(graphDecorationType, functionDefinitions);
    }
}

export function triggerDecorationUpdate(throttle = false, activeEditor: vscode.TextEditor | undefined) {
    if(timeout){
        clearTimeout(timeout);
        timeout = undefined;
    }

    if(throttle){
        timeout = setTimeout(() => { updateDecorations(activeEditor); }, 1000);
    }else{
        updateDecorations(activeEditor);
    }
}