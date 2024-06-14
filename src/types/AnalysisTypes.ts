export interface DebugLocation {
    column: number;
    file: string;
    line: number;
}

export interface SpearInstruction {
    energy: number;
    location: DebugLocation;
    opcode: string;
    calledFunction?: string;
}

export interface SpearNode {
    energy: number;
    name: string;
    type: number;
    instructions: Array<SpearInstruction>;
}

export interface SpearFunction {
    demangled: string;
    energy: number;
    external: boolean;
    file: string;
    name: string;
    nodes: Array<SpearNode>
}

export interface FileFunction {
    name: string;
    energy: number;
    calledFunctions: Array<String> 
}

export interface FileFunctionMapping {
    [key: string]: Array<FileFunction>;
}

export interface CallGraphNode {
    name: string;
    demangled: string;
    energy: number;
    calledFunctions: Array<string>
}

export interface Callgraph {
    [key: string]: CallGraphNode;
}