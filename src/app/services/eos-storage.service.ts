import { Injectable } from '@angular/core';
import { LS_EDIT_CARD } from '../consts/common.consts';

/**
 * Do not check unique CLASSIF_NAME for rubricator
 */
export const SI_RUBRICUNOQDISABLE = 'rubricSetUniqueDisabled';

@Injectable()
export class EosStorageService {
    /**
     * Service for keep any runtime data
     * Can keep data in localStorage for using in cases when App reboots
     */
    private _data: any;
    private _userId: string;

    constructor() {
        this.init('nobody');
    }

    init(userId: string) {
        this._data = {
            __storage: {}
        };
        if (userId) {
            this._userId = userId;
            const _val = localStorage.getItem(this._userId);
            try {
                this._data.__storage = JSON.parse(_val);
            } catch (e) {
                /* tslint:disable:no-console */
                console.log('error parsing', _val);
                /* tslint:enable:no-console */
            }
            if (!this._data.__storage) {
                this._data.__storage = {};
            }
            Object.assign(this._data, this._data.__storage);
            this.removeItem(LS_EDIT_CARD);
        }
    }

    /**
     * @param key key for data
     */
    public getItem(key: string): any {
        if (key && key !== '__storage' && key !== 'userOrder') {
            return this._data[key];
        }
    }

    /**
     *
     * @param key key for data
     * @param data data
     * @param saveToLocalStorage boolean data, force store data in localStorage
     */
    public setItem(key: string, data: any, saveToLocalStorage = false) {
        // console.log('storage', key, data);
        if (key && key !== '__storage' && key !== 'userOrder') {
            this._data[key] = data;
            // console.log('set to LS', key, typeof data, data);
            if (saveToLocalStorage) {
                this._data.__storage[key] = data;
                this._updateStorage();
            }
        }
    }

    /**
     *
     * @param key remove data with key
     */
    public removeItem(key: string) {
        if (key && key !== '__storage') {
            if (this._data.hasOwnProperty(key)) {
                delete this._data[key];
            }
            if (this._data.__storage.hasOwnProperty(key)) {
                delete this._data.__storage[key];
                this._updateStorage();
            }
        }
    }

    public setUserOrder(dictionary: string, node: string, ids: string[]) {
        if (!this._data.userOrder) {
            this._data.userOrder = {};
        }
        const userOrder = this._data.userOrder;

        if (!userOrder[dictionary]) {
            userOrder[dictionary] = {};
        }

        const dictionaryOrder = userOrder[dictionary];
        dictionaryOrder[node] = ids;
        this._data.__storage.userOrder = userOrder;
        this._updateStorage();
    }

    public getUserOrder(dictionary: string): string[] {
        if (this._data.userOrder) {
            if (this._data.userOrder[dictionary]) {
                return this._data.userOrder[dictionary];
            }
        }
        return null;
    }

    public setUserOrderState(dictionary: string, state: boolean): void {
        if (!this._data.userOrder) {
            this._data.userOrder = {};
        }
        if (!this._data.userOrder[dictionary]) {
            this._data.userOrder[dictionary] = {};
        }
        this._data.userOrder[dictionary].userOrderOn = state;
        this._updateStorage();
    }

    public getUserOrderState(dictionary: string): boolean {
        if (!this._data.userOrder) {
            return false;
        } else if (!this._data.userOrder[dictionary]) {
            return false;
        } else {
            return this._data.userOrder[dictionary].userOrderOn;
        }
    }

    private _updateStorage() {
        // todo: implement lazy update
        try {
            const _val = JSON.stringify(this._data.__storage);
            localStorage.setItem(this._userId, _val);
        } catch (e) {
            console.warn('error storing', e, this._data.__storage);
        }
    }
}
