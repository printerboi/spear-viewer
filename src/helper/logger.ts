/**
 * Defines a simple logger utility
 * Author: Maximilian Krebs
 */

import * as fs from 'fs';
import { PROJECTDIR } from '../extension';
import path from 'path';
import moment from 'moment';

/**
 * LogType enum to distinguish messages
 */
export enum LogType{
    DEBUG,
    ERROR
}

/**
 * Establishes a logger object that allows to interact with log files
 */
export class Logger {
    /**
     * Static method to log a message under the given type
     * @param type Log message type
     * @param message The actual message
     * @returns true if logging was successful, false otherwise
     */
    static log(type: LogType, message: string): boolean{
        try{
            fs.writeFileSync(this.getPath(type), `${this.getTimeStampString()} ${message}\n`, { flag: 'a' });
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    /**
     * Returns the path of the log file given a logtype
     * @param type Logtype of the log file to get the path for
     * @returns The pats of the log file
     */
    private static getPath(type: LogType): fs.PathLike{
        if(type === LogType.DEBUG){
            return path.join(PROJECTDIR, "debug.log" );
        }else if(type === LogType.ERROR){
            return path.join(PROJECTDIR, "error.log" );
        }else{
            return "";
        }
    }

    /**
     * Construct a time stamp string
     * @returns Current time stamp and string
     */
    private static getTimeStampString(): string{
        const timeObject = moment();
        return `[${timeObject.format()}]`;
    }
}