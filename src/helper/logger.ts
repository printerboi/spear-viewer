import * as fs from 'fs';
import { PROJECTDIR } from '../extension';
import path from 'path';
import moment from 'moment';

export enum LogType{
    DEBUG,
    ERROR
}

export class Logger {

    static log(type: LogType, message: string): boolean{
        try{
            fs.writeFileSync(this.getPath(type), `${this.getTimeStampString()} ${message}\n`, { flag: 'a' });
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    private static getPath(type: LogType): fs.PathLike{
        if(type === LogType.DEBUG){
            return path.join(PROJECTDIR, "debug.log" );
        }else if(type === LogType.ERROR){
            return path.join(PROJECTDIR, "error.log" );
        }else{
            return "";
        }
    }

    private static getTimeStampString(): string{
        const timeObject = moment();
        return `[${timeObject.format()}]`;
    }
}