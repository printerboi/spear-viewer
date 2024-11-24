/**
 * Defines several helper classes used during the analysis
 */

/**
 * Describes a debug location used to pin down the energy usage to the respective file and column
 */
export interface DebugLocation {
    column: number;
    file: string;
    line: number;
}

/**
 * Defines a instruction analyzed by SPEAR
 */
export interface SpearInstruction {
    energy: number;
    location: DebugLocation;
    opcode: string;
    calledFunction?: string;
}

/**
 * Defines a node used in the SPEAR programgraph
 */
export interface SpearNode {
    energy: number;
    name: string;
    type: number;
    instructions: Array<SpearInstruction>;
}

/**
 * Defines function analysed by SPEAR
 */
export interface SpearFunction {
    demangled: string;
    energy: number;
    external: boolean;
    file: string;
    name: string;
    nodes: Array<SpearNode>,
}

/**
 * Defines a function in the callgraph constructed by SPEAR
 */
export interface FileFunction {
    name: string;
    energy: number;
    calledFunctions: Array<String> 
}

/**
 * Defines a mapping of a function name to a array of called functions
 */
export interface FileFunctionMapping {
    [key: string]: Array<FileFunction>;
}

/**
 * Defines the actual callgraph node used in the callgraph UI component
 */
export interface CallGraphNode {
    name: string;
    demangled: string;
    energy: number;
    calledFunctions: Array<string>,
    path: string;
}

/**
 * Definesthe UI callgraph as mapping of node keys to node objects
 */
export interface Callgraph {
    [key: string]: CallGraphNode;
}