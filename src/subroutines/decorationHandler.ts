import * as vscode from 'vscode';
import { graphDecorationType } from '../decorations/graphDecoration';
import { AnalysisDecorationWrapper, EnergyFunction, energyDecorationType } from '../decorations/energyDecoration';

export let timeout: ReturnType<typeof setTimeout> | undefined = undefined;


export async function updateDecorations(activeEditor: vscode.TextEditor | undefined) {
    if(!activeEditor){
        return;
    }

    if(activeEditor.document.uri.scheme === "spearenergy"){
        const energyDecorations: vscode.DecorationOptions[] = [];
        const energyJson: EnergyFunction = JSON.parse('{"demangled":"main","name":"main","nodes":[{"energy":0.737994805908203,"instructions":[{"energy":0.05334352416992188,"location":{"column":4294967295,"file":"undefined","line":4294967295},"opcode":"alloca"},{"energy":0.05334352416992188,"location":{"column":4294967295,"file":"undefined","line":4294967295},"opcode":"alloca"},{"energy":0.05334352416992188,"location":{"column":4294967295,"file":"undefined","line":4294967295},"opcode":"alloca"},{"energy":0.05334352416992188,"location":{"column":4294967295,"file":"undefined","line":4294967295},"opcode":"alloca"},{"energy":0.05334352416992188,"location":{"column":4294967295,"file":"undefined","line":4294967295},"opcode":"alloca"},{"energy":0.05334352416992188,"location":{"column":4294967295,"file":"undefined","line":4294967295},"opcode":"alloca"},{"energy":0.07621679077148437,"location":{"column":0,"file":"programs/simple/bubblesort.cpp","line":0},"opcode":"call"},{"energy":0.07621679077148437,"location":{"column":22,"file":"programs/simple/bubblesort.cpp","line":19},"opcode":"call"},{"energy":0.03684970703125,"location":{"column":30,"file":"programs/simple/bubblesort.cpp","line":19},"opcode":"sext"},{"energy":0.07621679077148437,"location":{"column":0,"file":"/usr/bin/../lib64/gcc/x86_64-pc-linux-gnu/13.2.1/../../../../include/c++/13.2.1/bits/allocator.h","line":0},"opcode":"call"},{"energy":0.07621679077148437,"location":{"column":0,"file":"/usr/bin/../lib64/gcc/x86_64-pc-linux-gnu/13.2.1/../../../../include/c++/13.2.1/bits/new_allocator.h","line":0},"opcode":"call"},{"energy":0.07621679077148437,"location":{"column":22,"file":"programs/simple/bubblesort.cpp","line":19},"opcode":"invoke"}],"name":"entry"},{"energy":2.954094500732423,"instructions":[{"energy":0.07621679077148437,"location":{"column":0,"file":"/usr/bin/../lib64/gcc/x86_64-pc-linux-gnu/13.2.1/../../../../include/c++/13.2.1/bits/allocator.h","line":0},"opcode":"call"},{"energy":0.19783972778320313,"location":{"column":39,"file":"/usr/bin/../lib64/gcc/x86_64-pc-linux-gnu/13.2.1/../../../../include/c++/13.2.1/bits/allocator.h","line":184},"opcode":"call"},{"energy":0.07621679077148437,"location":{"column":9,"file":"programs/simple/bubblesort.cpp","line":21},"opcode":"call"},{"energy":0.03684970703125,"location":{"column":19,"file":"programs/simple/bubblesort.cpp","line":21},"opcode":"sub"},{"energy":0.05334352416992188,"location":{"column":9,"file":"programs/simple/bubblesort.cpp","line":21},"opcode":"store"},{"energy":0.8986444396972655,"location":{"column":27,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"call"},{"energy":0.05334352416992188,"location":{"column":27,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"getelementptr"},{"energy":0.05334352416992188,"location":{"column":27,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"store"},{"energy":0.8986444396972655,"location":{"column":44,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"call"},{"energy":0.05334352416992188,"location":{"column":44,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"getelementptr"},{"energy":0.05334352416992188,"location":{"column":44,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"store"},{"energy":0.05334352416992188,"location":{"column":51,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"getelementptr"},{"energy":0.05334352416992188,"location":{"column":51,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"store"},{"energy":0.05334352416992188,"location":{"column":5,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"getelementptr"},{"energy":0.05334352416992188,"location":{"column":5,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"load"},{"energy":0.05334352416992188,"location":{"column":5,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"getelementptr"},{"energy":0.05334352416992188,"location":{"column":5,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"load"},{"energy":0.05334352416992188,"location":{"column":5,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"getelementptr"},{"energy":0.05334352416992188,"location":{"column":5,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"load"},{"energy":0.07621679077148437,"location":{"column":5,"file":"programs/simple/bubblesort.cpp","line":22},"opcode":"invoke"}],"name":"invoke.cont"},{"energy":0.12162293701171875,"instructions":[{"energy":0.07621679077148437,"location":{"column":0,"file":"programs/simple/bubblesort.cpp","line":0},"opcode":"call"},{"energy":0.045406146240234375,"location":{"column":5,"file":"programs/simple/bubblesort.cpp","line":24},"opcode":"br"}],"name":"invoke.cont9"},{"energy":0,"instructions":[{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"landingpad"},{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"extractvalue"},{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"extractvalue"},{"energy":0,"location":{"column":0,"file":"/usr/bin/../lib64/gcc/x86_64-pc-linux-gnu/13.2.1/../../../../include/c++/13.2.1/bits/allocator.h","line":0},"opcode":"call"},{"energy":0,"location":{"column":39,"file":"/usr/bin/../lib64/gcc/x86_64-pc-linux-gnu/13.2.1/../../../../include/c++/13.2.1/bits/allocator.h","line":184},"opcode":"call"},{"energy":0,"location":{"column":22,"file":"programs/simple/bubblesort.cpp","line":19},"opcode":"br"}],"name":"lpad"},{"energy":0,"instructions":[{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"landingpad"},{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"extractvalue"},{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"extractvalue"},{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"call"},{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"br"}],"name":"lpad8"},{"energy":0.07621679077148437,"instructions":[{"energy":0.07621679077148437,"location":{"column":15,"file":"programs/simple/bubblesort.cpp","line":34},"opcode":"invoke"}],"name":"for.end30"},{"energy":0.6169909301757812,"instructions":[{"energy":0.487430615234375,"location":{"column":31,"file":"programs/simple/bubblesort.cpp","line":34},"opcode":"call"},{"energy":0.05334352416992188,"location":{"column":31,"file":"programs/simple/bubblesort.cpp","line":34},"opcode":"load"},{"energy":0.07621679077148437,"location":{"column":28,"file":"programs/simple/bubblesort.cpp","line":34},"opcode":"invoke"}],"name":"invoke.cont31"},{"energy":0.07621679077148437,"instructions":[{"energy":0.07621679077148437,"location":{"column":42,"file":"programs/simple/bubblesort.cpp","line":34},"opcode":"invoke"}],"name":"invoke.cont34"},{"energy":2.5914003295898436,"instructions":[{"energy":2.545994183349609,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"call"},{"energy":0.045406146240234375,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"ret"}],"name":"invoke.cont36"},{"energy":0,"instructions":[{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"phi"},{"energy":0,"location":{"column":1,"file":"programs/simple/bubblesort.cpp","line":37},"opcode":"phi"},{"energy":0,"location":{"column":22,"file":"programs/simple/bubblesort.cpp","line":19},"opcode":"insertvalue"},{"energy":0,"location":{"column":22,"file":"programs/simple/bubblesort.cpp","line":19},"opcode":"insertvalue"},{"energy":0,"location":{"column":22,"file":"programs/simple/bubblesort.cpp","line":19},"opcode":"resume"}],"name":"eh.resume"}]}');
        const decWrapper = new AnalysisDecorationWrapper(energyJson, "programs/simple/bubblesort.cpp");

        for(let i = 0; i < activeEditor.document.lineCount; i++){
            const decoration = { range: new vscode.Range(i, 0, i, 0) };
            activeEditor.setDecorations(vscode.window.createTextEditorDecorationType(decWrapper.getDecoration(i)), [decoration]);
        }
    }

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