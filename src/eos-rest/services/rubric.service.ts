import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { ALL_ROWS } from '../core/consts';
import { Utils } from '../core/utils';
const INSTANCE_NAME = 'RUBRIC_CL';

@Injectable()
export class RubricService {

    constructor(private _pipe: PipRX) { }

    getAll(params?: any): Promise<any> {
        if (params) {
            params = Utils.criteries(params);
        } else {
            params = ALL_ROWS;
        }
        return this._pipe.read({ [INSTANCE_NAME]: params }).toPromise<any>();
    }

    create(data: any, params?: any): Promise<any> {
        return new Promise((res, rej) => {
            rej('not implemented');
        })
    }

    update(data: any, params?: any): Promise<any> {
        return new Promise((res, rej) => {
            rej('not implemented');
        });
    }

    delete(data: any, params?: any): Promise<any> {
        return new Promise((res, rej) => {
            rej('not implemented');
        });
    }
}
