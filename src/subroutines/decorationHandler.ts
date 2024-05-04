import * as vscode from 'vscode';
import { graphDecorationType } from '../decorations/graphDecoration';

export let timeout: ReturnType<typeof setTimeout> | undefined = undefined;


export async function updateDecorations(activeEditor: vscode.TextEditor | undefined) {
    if(!activeEditor){
        return;
    }

    /* // RegEx to detect C/C++ function definitions
    // See https://www.researchgate.net/figure/Regular-expression-to-identify-C-C-function-declarations_fig7_368244118
    const parseRegEx = /(static|bool|char|int|float|double|void|struct).*\(.*\)*.*\{/gm;
    const code = activeEditor.document.getText(); */

    console.log(activeEditor.document.uri);


    const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', activeEditor.document.uri);

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


    /* const functionDefinitions: vscode.DecorationOptions[] = [];
    
    let match;
    while ((match = parseRegEx.exec(code))) {
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(match.index + match[0].length);

        const hoverMessage = new vscode.MarkdownString(`The energy for ${match[0]} can be calculated!<br>[📈 Show energy graph](#) **|** [⚡ Calculate energy usage](#)`);
        hoverMessage.isTrusted = true;

        const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: hoverMessage };
        
        functionDefinitions.push(decoration);
    }

    activeEditor.setDecorations(graphDecorationType, functionDefinitions); */
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