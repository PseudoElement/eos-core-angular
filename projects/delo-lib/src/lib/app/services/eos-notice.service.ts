import { Injectable } from '@angular/core';

@Injectable()
export class EosNoticeService {
    _notices: string[];

    constructor() {
        this._notices = ['Notice1', 'Notice2', 'Notice3'];
    }

    get notices() {
        return this._notices;
    }

    get noticesCount() {
        return this._notices.length;
    }

}
