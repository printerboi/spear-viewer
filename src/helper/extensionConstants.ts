/**
 * Defines several helping constants for the extension
 * Author: Maximilian Krebs
 */

import * as vscode from 'vscode';

// Define the prefix used throughout the extension
export const APPPREFIX = 'spear-viewer';

// Define extension wide settings
interface Settings {
    APPPATH: string | undefined;
    PROGRAMMSPATH: string | undefined;
    ITERATIONS: number | undefined;
}


/**
 * Settingsmanager to handle the interaction of the user with the 
 * 
 */
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
        };
    }

    /**
     * Refresh the configuration
     */
    private refresh(): void {
        this.configuration = vscode.workspace.getConfiguration("spear-viewer");
        this.settings = this.populate();
    }

    /**
     * Get the APPPATH configuration value
     */
    getAPPPATH(): string | undefined {
        this.refresh();
        return this.settings.APPPATH;
    }

    /**
     * Get the PROGRAMMPATH configuration value
     */
    getPROGRAMMSPATH(): string | undefined {
        this.refresh();
        return this.settings.PROGRAMMSPATH;
    }

    /**
     * Get the ITERATIONS configuration value
     */
    getITERATIONS(): number | undefined {
        this.refresh();
        return this.settings.ITERATIONS;
    }

}

export const SETTINGS = new SettingsManager();