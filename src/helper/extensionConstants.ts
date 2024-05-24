import * as vscode from 'vscode';


export const APPPREFIX = 'spear-viewer';

interface Settings {
    APPPATH: string | undefined;
    PROGRAMMSPATH: string | undefined;
    ITERATIONS: number | undefined;
    THRESHOLD: number | undefined;
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
}

export const SETTINGS = new SettingsManager();