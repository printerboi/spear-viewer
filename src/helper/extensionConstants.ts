import * as vscode from 'vscode';


export const APPPREFIX = 'spear-viewer';

interface Settings {
    APPPATH: string | undefined;
    PROGRAMMSPATH: string | undefined;
    ITERATIONS: number | undefined;
    THRESHOLD: number | undefined;
    LOOPBOUND: number | undefined;
    STRATEGY: string | undefined;
}


export class SettingsManager{
    settings: Settings;
    configuration: vscode.WorkspaceConfiguration;
    
    constructor(){
        this.configuration = vscode.workspace.getConfiguration("spear-viewer");
        this.settings = this.populate();
    }

    private populate(): Settings {
        return {
            APPPATH: this.configuration.get("apppath"),
            PROGRAMMSPATH: this.configuration.get("profile.programspath"),
            ITERATIONS: this.configuration.get("profile.iterations"),
            THRESHOLD: this.configuration.get("analyze.threshold"),
            LOOPBOUND: this.configuration.get("analyze.loopbound"),
            STRATEGY: this.configuration.get("analyze.strategy"),
        };
    }

    private refresh(): void {
        this.configuration = vscode.workspace.getConfiguration("spear-viewer");
        this.settings = this.populate();
    }

    getAPPPATH(): string | undefined {
        this.refresh();
        return this.settings.APPPATH;
    }

    getPROGRAMMSPATH(): string | undefined {
        this.refresh();
        return this.settings.PROGRAMMSPATH;
    }

    getITERATIONS(): number | undefined {
        this.refresh();
        return this.settings.ITERATIONS;
    }

    getTHRESHOLD(): number | undefined {
        this.refresh();
        return this.settings.THRESHOLD;
    }

    getLOOPBOUND(): number | undefined {
        this.refresh();
        return this.settings.LOOPBOUND;
    }

    getSTRATEGY(): string | undefined {
        this.refresh();
        return this.settings.STRATEGY;
    }
}

export const SETTINGS = new SettingsManager();