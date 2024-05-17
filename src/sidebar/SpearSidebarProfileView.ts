import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TMPDIR } from '../extension';

interface ProfileEnergyItem {
    category: string;
    energy: number;
}

export class SpearSidebarProfileProvider implements vscode.TreeDataProvider<ProfileItem> {  
    private _onDidChangeTreeData: vscode.EventEmitter<ProfileItem | undefined | null | void> = new vscode.EventEmitter<ProfileItem | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<ProfileItem | undefined | null | void> = this._onDidChangeTreeData.event;


    getTreeItem(element: ProfileItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ProfileItem): Thenable<Array<ProfileItem>> {
        if (!TMPDIR) {
            vscode.window.showInformationMessage('No profile');
            return Promise.resolve([]);
        }

        if (element) {
            return Promise.resolve([]);
        } else {
            const profileJsonPath = path.join(TMPDIR, 'profile.json');

            console.log(profileJsonPath);

            if (this.fileExists(profileJsonPath)) {
                return Promise.resolve(this.getProfileInformation(profileJsonPath));
            } else {
                vscode.window.showInformationMessage('No profile found!');
                return Promise.resolve([new ProfileItem("No Profile", 0.0, vscode.TreeItemCollapsibleState.None, true)]);
            }
        }
    }

    private getProfileInformation(profileJsonPath: string): Array<ProfileItem>{
        if(this.fileExists(profileJsonPath)) {
            const toProfileItem = (item: ProfileEnergyItem): ProfileItem => {
                return new ProfileItem(item.category, item.energy, vscode.TreeItemCollapsibleState.None, false);
            };

            const profileJson = JSON.parse(fs.readFileSync(profileJsonPath, "utf-8"));

            if(profileJson.profile){
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

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private fileExists(p: string): boolean {
        try {
        fs.accessSync(p);
        } catch (err) {
        return false;
        }
        return true;
    }
}

class ProfileItem extends vscode.TreeItem {
  constructor(public readonly label: string, private energy: number, public readonly collapsibleState: vscode.TreeItemCollapsibleState, isErrorMsg: boolean) {
    super(label, vscode.TreeItemCollapsibleState.None);
    if(isErrorMsg){
        this.description = "Please generate one first!";
    }else{
        this.description = this.energy.toFixed(3);
    }
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  };
}