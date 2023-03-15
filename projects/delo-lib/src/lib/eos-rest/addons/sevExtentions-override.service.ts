import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })

export class SaveExtensionsOverrideService {
    constructor() {}
    saveExtensions(dictionary: any, data: any, result: any, node: any, isCreate = false): Promise<any> {
        return Promise.resolve(null);
    }

}