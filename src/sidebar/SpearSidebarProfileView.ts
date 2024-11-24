/**
 * Defines the UI component for the profile information
 * Author: Maximilian Krebs
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PROJECTDIR } from '../extension';

/**
 * Define a item descriping the profile category and its corresponding energy cost
 */
interface ProfileEnergyItem {
    category: string;
    energy: number;
}

/**
 * Tree view provider for profile information
 */
export class SpearSidebarProfileProvider implements vscode.TreeDataProvider<ProfileItem> {
    // Changehandler
    private _onDidChangeTreeData: vscode.EventEmitter<ProfileItem | undefined | null | void> = new vscode.EventEmitter<ProfileItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ProfileItem | undefined | null | void> = this._onDidChangeTreeData.event;

    /**
     * Construct a tree view item. This is a dummy function, as we display each category as child item under a single dummy parent element
     * @param element Element to construct the item for
     * @returns The tree item
     */
    getTreeItem(element: ProfileItem): vscode.TreeItem {
        return element;
    }

    /**
     * Construct the tree item children for a given element
     * @param element The element to construct the children for
     * @returns Array of children items
     */
    getChildren(element?: ProfileItem): Thenable<Array<ProfileItem>> {
        // Check if a project dir exists
        if (!PROJECTDIR) {
            vscode.window.showInformationMessage('No project directory. Please create .spear directory in this folder!');
            return Promise.resolve([]);
        }

        // If we encounter existing element = a child element, return an empty array, as we do not have children of children
        if (element) {
            return Promise.resolve([]);
        } else {
            // If we encouter the dummy parent item...
            const profileJsonPath = path.join(PROJECTDIR, 'profile.json');

            // Check if a profile exists
            if (this.fileExists(profileJsonPath)) {
                // Parse the profile file
                return Promise.resolve(this.getProfileInformation(profileJsonPath));
            } else {
                vscode.window.showInformationMessage('No profile found!');
                return Promise.resolve([new ProfileItem("No Profile", 0.0, vscode.TreeItemCollapsibleState.None, true)]);
            }
        }
    }

    /**
     * Parse a given profile
     * @param profileJsonPath Path to the profile json
     * @returns Array of ProfileItems containing information from the given profile json
     */
    private getProfileInformation(profileJsonPath: string): Array<ProfileItem>{
        // Check if given profile exists
        if(this.fileExists(profileJsonPath)) {
            /**
             * Helper function to convert a profile category to the tree item
             * @param item Category informtion
             * @returns Profile tree item
             */
            const toProfileItem = (item: ProfileEnergyItem): ProfileItem => {
                return new ProfileItem(item.category, item.energy, vscode.TreeItemCollapsibleState.None, false);
            };

            // Parse the profile with the JS JSON parser
            const profileJson = JSON.parse(fs.readFileSync(profileJsonPath, "utf-8"));

            // Check if the profile contains the information we need
            if(profileJson.profile){
                // Map the categories to profile items
                return Object.keys(profileJson.profile).map((key) => {
                    return toProfileItem({ category: key, energy: profileJson.profile[key] });
                });
            }else{
                return [];
            }
        }else{
            return [];
        }
    }

    /**
     * Refresh the tree view
     */
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    /**
     * Check if a given file exists
     * @param p Path to the file
     * @returns True if the file exists, false otherwise
     */
    private fileExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
        return false;
        }
        return true;
    }
}

/**
 * Profile item class to display profile information as tree item
 */
class ProfileItem extends vscode.TreeItem {
  constructor(public readonly label: string, private energy: number, public readonly collapsibleState: vscode.TreeItemCollapsibleState, isErrorMsg: boolean) {
    super(label, vscode.TreeItemCollapsibleState.None);
    if(isErrorMsg){
        this.description = "Please generate one first!";
    }else{
        this.description = `${this.energy.toFixed(3)} J`;
    }
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  };
}