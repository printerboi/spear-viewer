import * as vscode from 'vscode';
import * as fs from 'fs';
import { ProfileProvider, PROJECTDIR } from '../extension';
import util from 'util';
import { SETTINGS } from '../helper/extensionConstants';

const exec = util.promisify(require('child_process').exec);


/**
 * Profile the system 
 */
export default async function profile() {
    const APPPATH = SETTINGS.getAPPPATH();
    const ITERATIONS = SETTINGS.getITERATIONS();
    const PROGRAMMSPATH = SETTINGS.getPROGRAMMSPATH();



    // Remove a previously generated profile if present
    if(fs.existsSync(`${PROJECTDIR}/profile.json`)){
        fs.rmSync(`${PROJECTDIR}/profile.json`);
    }

    try{
        // Open a progress notification
        const profileOperation = vscode.window.withProgress({
            cancellable: false,
            location: vscode.ProgressLocation.Notification,
            title: "SPEAR"
        },
        async (progress, token) => {
            // Create a promise to handle the asynchronisly exectued profile operation
            return new Promise<void>(async (resolve, reject) => {
                // Report the start of the profiling to the user
                progress.report({ message: "Starting the profiling. This may take some while! Grab a coffee ☕" });
                
                try{
                    // Execute spears profile routine
                    // We prepend `pkexec` here so the user gets prompted for their password so wen can execute spear with elevated rights
                    await exec(`pkexec ${APPPATH} profile --iterations ${ITERATIONS} --model ${PROGRAMMSPATH} --savelocation ${PROJECTDIR}`);
                }catch(profilingError){
                    // If the command fails, or the rights elevation failed, reject the promise
                    console.error(profilingError);
                    reject();
                }				
                // After the profiling resolve the promise
                resolve();
            });
        });

        // Handle the profile promise
        profileOperation.then(
            () => {
                // If the profiling operation succeeds
                vscode.window.showInformationMessage("Profiling finished! ⚡");
                ProfileProvider.refresh();
            },
            () => {
                // If the profiling fails
                vscode.window.showErrorMessage("Profiling failed!");
            }
        );

    }catch(e){
        console.error(e);
        vscode.window.showErrorMessage('Profiling failed!');
    }
}