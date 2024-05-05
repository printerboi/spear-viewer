import * as vscode from 'vscode';
import { BADCOLOR, Color, GOODCOLOR, MEDIUMCOLOR, interpolate } from '../helper/colorHelper';

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
    instructions: Array<EnergyInstruction>
}

/**
 * Provides energy data of a Node object - see SPEAR class EnrgyNode. Consists of multiple EnergyNode objects.
 */
interface EnergyFunction {
    demangled: string,
    name: string,
    nodes: Array<EnergyNode>,
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
     * 
     * @param engjsn 
     * @param relevantFile 
     */
    constructor(engjsn: any, relevantFile: string){
        // Intialize the analysis result and the relevant file for the wrapper
        this.energyJson = engjsn;
        this.relevantFile = relevantFile;

        // Initialize the line -> energy usage mapping as empty numbers array
        this.lineEnergyMapping = Array<number>();

        // Set the maxval to 0, as we don't except negative energy values, 0 is the lowest value that can occur
        this.maxVal = 0;

        // Parse the analysis result
        this.parse();
        console.log(this.lineEnergyMapping);
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
            func.nodes.forEach((node: EnergyNode) => {
                // Iterate over the contained EnergyInstruction objects
                node.instructions.forEach((inst: EnergyInstruction) => {
                    // If the locations file corresponds to the provided relevantFile, handle the saved energy in the instruction
                    if(inst.location.file === this.relevantFile){
                        // Aggregate the energy if the line was referenced previously.
                        // This ensures, that we add the energy value if a line contains multiple instructions
                        if(!this.lineEnergyMapping[inst.location.line]){
                            this.lineEnergyMapping[inst.location.line] = inst.energy;
                        }else{
                            this.lineEnergyMapping[inst.location.line] += inst.energy;
                        }
                    }
                });
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
     * Returns a object containing render options for a vscode decoration
     * @param lineNumber line number used to calculate the color used for highlighting
     * @returns An object containing render options for a vscode decoration
     */
    getDecoration(lineNumber: number): vscode.DecorationRenderOptions{
        // Get the color and the used energy with the helper methods and the provided linenumber
        return {
            backgroundColor: this.getColor(lineNumber),
            isWholeLine: true,
            after: {
                contentText: this.getEnergyAsString(lineNumber),
                margin: "0px 0px 0px 100px",
                color: "lightgrey",
            }
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
            return `${this.lineEnergyMapping[lineNumber].toString()} J`;
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

        return `rgba(${interpolatedColor.red}, ${interpolatedColor.green}, ${interpolatedColor.blue}, 0.3)`;
    }
}