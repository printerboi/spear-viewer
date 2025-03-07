/**
 * Energy decoration file. Handles the coloured energy highlights
 * Author: Maximilian Krebs
 * 
 */

import * as vscode from 'vscode';
import { BADCOLOR, Color, GOODCOLOR, MEDIUMCOLOR, interpolate } from '../helper/colorHelper';

/**
 * Enum to encode the type of a node
 */
enum NodeType {
    UNDEFINED = 0,
    NODE = 1,
    LOOPNODE = 2
}

/**
 * Stores the DebugLoc Information provided by LLVM
 */
interface EnergyLocation {
    file: string,
    column: number,
    line: number
}

/**
 * Provides energy data of an EnergyInstruction object - see SPEAR class EnergyInstruction
 */
interface EnergyInstruction {
    energy: number,
    location: EnergyLocation,
    opcode: string
}

/**
 * Provides energy data of a Node object - see SPEAR class EnrgyNode. Consists of multiple EnergyInstruction objects
 */
interface EnergyNode{
    energy: number,
    type: NodeType,
    instructions: Array<EnergyInstruction>
}

/**
 * Define a Subgraph interface that represents a ProgramGraph inside LoopNodes
 */
interface Subgraph { 
    nodes: Array<EnergyNode | EnergyLoopNode>
}

/**
 * Defines an interface to represent a LoopNode
 */
interface EnergyLoopNode{
    type: NodeType,
    repetitions: number,
    subgraphs: Array<Subgraph>
}

/**
 * Provides energy data of a Node object - see SPEAR class EnrgyNode. Consists of multiple EnergyNode objects.
 */
interface EnergyFunction {
    demangled: string,
    name: string,
    nodes: Array<EnergyNode | EnergyLoopNode>,
}

/**
 * Helper type to represent the result of the SPEAR analysis output.
 */
export interface AnalysisResult {
    duration: number,
    functions: Array<EnergyFunction>
}


/**
 * Decoration wrapper class. Provides methods to map a given line number to an energy value with respect to the
 * analysis result calculated by spear
 */
export class AnalysisDecorationWrapper {
    /**
     * Result of the spear analysis given on object creation
     */
    energyJson: AnalysisResult;

    /** 
     * File the energy highlighting should be calculated for.
     * SPEAR provides additional debug information for called functions, outside of the file, that should be analyzed.
     * With the given string these additional debug information gets filtered out.
     */
    relevantFile: string;

    /**
     * Stores a mapping between a line number and the used energy provided by spear
     */
    lineEnergyMapping: Array<number>;

    /**
     * Max used energy by the analysed code
     */
    maxVal: number;

    /**
     * Context of vscode
     */
    context: vscode.ExtensionContext;

    /**
     * Defines a energy threshold, which hides energy decorations with an energy value lower than the defined value
     */
    threshold: number;


    /**
     * Constructs the energyDecoration object
     * @param engjsn JSON file containing the analysis result
     * @param relevantFile Files set to be analysed via the SPEAR-Viewer config file
     */
    constructor(engjsn: any, relevantFile: string, context: vscode.ExtensionContext, threshold: number){
        // Intialize the analysis result and the relevant file for the wrapper
        this.energyJson = engjsn;
        this.relevantFile = relevantFile;

        // Initialize the line -> energy usage mapping as empty numbers array
        this.lineEnergyMapping = Array<number>();

        this.context =  context;

        // Set the maxval to 0, as we don't except negative energy values, 0 is the lowest value that can occur
        this.maxVal = 0;

        this.threshold = threshold;

        // Parse the analysis result
        this.parse();

    }

    /**
     * Iterates over the objects energyJson property and fills the lineEnergyMapping array.
     * Takes a member of eneryJson and tests if the caontained EnergyInstruction corresponds to
     * the relevantFile property of the object.
     */
    parse(){
        // Iterate over the EnergyFunction objects
        this.energyJson.functions.forEach((func) => {
            // Iterate over the contained EnergyNodes of the Energyfunction
            func.nodes.forEach((node: EnergyNode | EnergyLoopNode) => {
                this.parseNode(node);
            });
        });

        // Iterate over the mapping and determine the biggest value
        // The biggest value is used to calculate the color interpolation
        this.lineEnergyMapping.forEach((lem) => {
            if(lem > this.maxVal){
                this.maxVal = lem;
            }
        });
    }

    /**
     * Select the method to be called in order to handle the given node type 
     * @param node Node to be parsed
     * @param multiplier Loop multiplier
     */
    parseNode(node: EnergyNode | EnergyLoopNode, multiplier: number = 1){
        if(node.type === 1){
            const normalnode = node as EnergyNode;
            this.parseNormalNode(normalnode, multiplier);
        }else if(node.type === 2){
            const loopnode = node as EnergyLoopNode;
            this.parseLoopNode(loopnode, multiplier);
        }else{
            throw Error("Node state undefined!");
        }
    }

    /**
     * Parse a given node and calculate the energy
     * @param normalnode Node to be parsed
     * @param multiplier Loop multiplire
     */
    parseNormalNode(normalnode: EnergyNode, multiplier: number = 1){
        // Iterate over the contained EnergyInstruction objects
        normalnode.instructions.forEach((inst: EnergyInstruction) => {
            // If the locations file corresponds to the provided relevantFile, handle the saved energy in the instruction
            if(inst.location.file === this.relevantFile){
                // Aggregate the energy if the line was referenced previously.
                // This ensures, that we add the energy value if a line contains multiple instructions

                // We need to substract 1 here, as clang outputs its debug info starting at column 1
                // Vscode starts its line numbering at 0...
                const val = multiplier * inst.energy;
                if(!this.lineEnergyMapping[inst.location.line-1]){
                    this.lineEnergyMapping[inst.location.line-1] = val;
                }else{
                    this.lineEnergyMapping[inst.location.line-1] += val;
                }
            }
        });
    }

    /**
     * Parse a given LoopNode
     * @param loopnode LoopNode to be parsed
     * @param multiplier LoopMultiplier
     */
    parseLoopNode(loopnode: EnergyLoopNode, multiplier: number = 1){
        loopnode.subgraphs.forEach((subgraph: Subgraph) => {
            subgraph.nodes.forEach((node: EnergyNode | EnergyLoopNode) => {
                this.parseNode(node, multiplier * loopnode.repetitions);
            });
        });
    }

    /**
     * Returns a object containing render options for a vscode decoration
     * @param lineNumber line number used to calculate the color used for highlighting
     * @returns An object containing render options for a vscode decoration
     */
    getDecoration(lineNumber: number): vscode.DecorationRenderOptions{
        // Get the color and the used energy with the helper methods and the provided linenumber
        return {
            isWholeLine: true,
            gutterIconPath: this.getGutterIcon(lineNumber),
        };
    }

    /**
     * Returns the used energy as string for the provided line
     * @param lineNumber line for which the energy should be returned
     * @returns String of the used energy 
     */
    getEnergyAsString(lineNumber: number): string{
        // If the provided line is valid and we have a energy value for this line
        if(lineNumber && this.lineEnergyMapping[lineNumber]){
            // Return the energy postfixed with the unit joule
            return `${this.lineEnergyMapping[lineNumber].toFixed(3).toString()}`;
        }

        // In any other case return an empty string
        return "";
    }

    /**
     * Calculate the color for a given line
     * @param lineNumber Line the highlighting color should be calculated for
     * @returns String descriping the color as rgba value
     */
    getColor(lineNumber: number): string{
        let interpolatedColor: Color = {red: 0, green: 0, blue: 0};

        if(this.maxVal !== 0 && this.lineEnergyMapping[lineNumber] !== undefined){
            if(this.lineEnergyMapping[lineNumber] < this.maxVal/2){
                interpolatedColor = interpolate(GOODCOLOR, MEDIUMCOLOR, this.lineEnergyMapping[lineNumber]/(this.maxVal/2));
            }else{
                interpolatedColor = interpolate(MEDIUMCOLOR, BADCOLOR, (this.lineEnergyMapping[lineNumber] - this.maxVal/2)/(this.maxVal/2));
            }    
        }else{
            return `rgba(0, 0, 0, 0.0)`;
        }

        return `rgba(${interpolatedColor.red}, ${interpolatedColor.green}, ${interpolatedColor.blue}, 0.7)`;
    }

    /**
     * Returns the actual gutter icon that highlights the energy used by the given line
     * @param lineNumber The line number, the gutter icon will be displayed
     * @returns A encoded svg object as URI to be displayed by vscode
     */
    getGutterIcon(lineNumber: number): vscode.Uri | undefined{
        const THRESHOLD = this.threshold;

        if(THRESHOLD !== undefined){
            // Check if the value of the line is above the defined threshold
            if(this.lineEnergyMapping[lineNumber] > THRESHOLD){
                // Construct the svg image that will be displayed in the line
                const svg = `<svg width="10" height="15" viewBox="0 0 10 15" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="10" height="10" fill="${this.getColor(lineNumber)}" stroke="white" stroke-width="0"/></svg>`;
                const icon = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
                return vscode.Uri.parse(icon);
            }
        }
    }
}