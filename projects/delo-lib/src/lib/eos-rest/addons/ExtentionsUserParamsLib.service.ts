import { Injectable } from '@angular/core';
@Injectable()
export class ExetentionsUserParamsLib {
    NOTE: string = '';
    constructor() {}
    public async loadDepartments(value: string): Promise<string> {
        return this.NOTE;
    }
}