import * as vscode from 'vscode';


export const APPPREFIX = 'spear-viewer';

const SETTINGS = vscode.workspace.getConfiguration("spear-viewer");

// Get the user defined configuration
export const APPPATH = SETTINGS.get("apppath");
export const PROGRAMMSPATH = SETTINGS.get("profile.programspath");
export const ITERATIONS = SETTINGS.get("profile.iterations");