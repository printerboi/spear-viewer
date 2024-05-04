import * as vscode from 'vscode';
import { BADCOLOR, Color, GOODCOLOR, MEDIUMCOLOR, interpolate } from '../helper/colorHelper';

interface EnergyLocation {
    file: string,
    column: number,
    line: number
}

interface EnergyInstruction {
    energy: number,
    location: EnergyLocation,
    opcode: string
}

interface EnergyNode{
    energy: number,
    instructions: Array<EnergyInstruction>
}

export interface EnergyFunction {
    demangled: string,
    name: string,
    nodes: Array<EnergyNode>,
}


export class AnalysisDecorationWrapper {
    energyJson: EnergyFunction;
    relevantFile: string;
    lineEnergyMapping: Array<number>;
    maxVal: number;


    constructor(engjsn: any, relevantFile: string){
        this.energyJson = engjsn;
        this.relevantFile = relevantFile;
        this.lineEnergyMapping = Array<number>();
        this.maxVal = 0;

        this.parse();
        console.log(this.lineEnergyMapping);
    }

    parse(){
        this.energyJson.nodes.forEach((node: EnergyNode) => {
            node.instructions.forEach((inst: EnergyInstruction) => {
                if(inst.location.file === this.relevantFile){
                    if(!this.lineEnergyMapping[inst.location.line]){
                        this.lineEnergyMapping[inst.location.line] = inst.energy;
                    }else{
                        this.lineEnergyMapping[inst.location.line] += inst.energy;
                    }
                }
            });
        });

        this.lineEnergyMapping.forEach((lem) => {
            if(lem > this.maxVal){
                this.maxVal = lem;
            }
        });
    }

    getDecoration(lineNumber: number): vscode.DecorationRenderOptions{
        return {
            backgroundColor: this.getColor(lineNumber),
            isWholeLine: true
        };
    }

    getColor(lineNumber: number){
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

export const energyDecorationType = vscode.window.createTextEditorDecorationType({
    borderWidth: '3px',
    borderStyle: 'solid',
    overviewRulerColor: 'red',
    overviewRulerLane: vscode.OverviewRulerLane.Left,
    light: {
        // this color will be used in light color themes
        borderColor: 'red'
    },
    dark: {
        // this color will be used in dark color themes
        borderColor: 'red'
    }
});