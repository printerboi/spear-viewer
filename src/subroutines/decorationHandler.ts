/**
 * Defines a decoration handler that enables the interaction with the decorations of lines
 * Author: Maximilian Krebs
 */

import * as vscode from 'vscode';
import { AnalysisDecorationWrapper, AnalysisResult } from '../decorations/energyDecoration';
import qs from 'querystring';
import { AnalysisOptions, ConfigParser } from '../helper/configParser';

// Define a timeout to be used to handle updates of decorations
export let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

/**
 * Decoration type to enable the interaction with the line decoration
 */
export const graphDecorationType = vscode.window.createTextEditorDecorationType({
    light: {},
    dark: {}
});

/**
 * Updates the decorations for the given vscode TextEditor
 * @param activeEditor TextEditor the decorations should be updated for
 */
export async function updateDecorations(activeEditor: vscode.TextEditor | undefined, context: vscode.ExtensionContext) {
    // Check if the given editor is valid, return otherwise
    if(!activeEditor){
        return;
    }

    // Calculate the symbols of the open document
    // This yields the function definitions in the current file
    const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', activeEditor.document.uri);

    // Check thath the currently open document uses the spearenergy uri scheme
    if(activeEditor.document.uri.scheme === "spearenergy"){
        if(ConfigParser.validateConfig()){
            const analysisOptions: AnalysisOptions | undefined = ConfigParser.getAnalysisOptions();

            if(analysisOptions !== undefined){
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
                            const decWrapper = new AnalysisDecorationWrapper(energyJson, activeEditor.document.fileName, context, analysisOptions.threshold);

                            // Iterate over the lines of the document
                            for(let i = 0; i < activeEditor.document.lineCount; i++){
                                // Construct a decoration for this line
                                let hoverMessage = undefined;
                                const energyAsString = decWrapper.getEnergyAsString(i);
                                if(energyAsString !== ""){
                                    hoverMessage = new vscode.MarkdownString(`${decWrapper.getEnergyAsString(i)} J`);

                                    const decoration = { range: new vscode.Range(i, 0, i, 0), hoverMessage: hoverMessage };

                                    // Activate the decoration and get the RenderOptions with the wrapper
                                    activeEditor.setDecorations(vscode.window.createTextEditorDecorationType(decWrapper.getDecoration(i)), [decoration]);
                                }
                                
                            }
                        }
                    }catch(e){
                        console.error(e);
                        console.error("Analysis could not be parsed");
                    }
                }
            }
        }
    }

    // If we have found functions...
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

            // If we could parse a function name
            if(parsedName){
                // Construct the URI to activat the graph viewer
                const graphCommandUri = vscode.Uri.parse(`command:spear-viewer.graph?${encodeURIComponent(JSON.stringify({ functionname: parsedName }))}`);

                // Build the hover message
                const hoverMessage = new vscode.MarkdownString(`[📈 Show energy graph](${graphCommandUri})`);
                hoverMessage.isTrusted = true;
                
                // Construct the decoration in order to display the graph button to the user
                const decoration = { range: new vscode.Range(symbol.location.range.start, new vscode.Position(symbol.location.range.start.line, 10)), hoverMessage: hoverMessage };
                functionDefinitions.push(decoration);
            }
        });

        // Set the decorations
        activeEditor.setDecorations(graphDecorationType, functionDefinitions);
    }
}

/**
 * Function to recalculate the decorations on the given editor
 * @param throttle If true reset the timeout
 * @param activeEditor Active editor the decorations should be updated for
 * @param context VSC context
 */
export function triggerDecorationUpdate(throttle = false, activeEditor: vscode.TextEditor | undefined, context: vscode.ExtensionContext) {
    // If a timeout is defined...
    if(timeout){
        clearTimeout(timeout);
        timeout = undefined;
    }

    // If the caller requests the initial start of the updater, set the timeout
    if(throttle){
        timeout = setTimeout(() => { updateDecorations(activeEditor, context); }, 1000);
    }else{
        // Otherwise just update the current editor
        updateDecorations(activeEditor, context);
    }
}