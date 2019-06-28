import { AbstractControl } from '@angular/forms';
import { INPUT_ERROR_MESSAGES } from '../consts/common.consts';

export class EosUtils {
    static pad(n: number): string {
        return n < 10 ? '0' + n : '' + n;
    }

    static dateToString(d: Date): string {
        if (d instanceof Date) {
            return d.getFullYear() +
                '-' + EosUtils.pad(d.getMonth() + 1) +
                '-' + EosUtils.pad(d.getDate());
            /*'T' + pad(d.getHours()) +
            ':' + pad(d.getMinutes()) +
            ':' + pad(d.getSeconds()); */
        } else {
            return null;
        }
    }

    static dateToStringValue(date: Date): string {
        if (date instanceof Date && !isNaN(date.getTime())) {
            return [EosUtils.pad(date.getDate()), EosUtils.pad(date.getMonth() + 1), date.getFullYear()].join('.');
        } else {
            return null;
        }
    }

    static setValueByPath(data: any, path: string, value: any): any {
        const _path = path.split('.');
        const tail = _path.splice(-1, 1);
        data = data || {};
        let elem = data;
        if (_path.length) {
            elem = EosUtils.getValueByPath(data, _path.join('.'), true);
        }
        const key = EosUtils.getKeyIndex(tail[0]);
        if (key.idx === undefined) {
            elem[key.value] = value;
        } else {
            if (!(elem[key.value] instanceof Array)) {
                elem[key.value] = [];
            }
            elem[key.value][key.idx] = value;
        }
        return data;
    }

    static getValueByPath(data: any, path: string, initPath = false): any {
        const _path = path.split('.');
        let elem = data;
        for (let i = 0; i < _path.length && (elem !== undefined && elem !== null); i++) { // dive deep while property exist
            const key = EosUtils.getKeyIndex(_path[i]);
            if (initPath) {
                if (key.idx === undefined) {
                    if (elem[key.value] === undefined) {
                        elem[key.value] = {};
                    }
                } else {
                    if (elem[key.value] === undefined) {
                        elem[key.value] = [];
                    }
                    if (elem[key.value][key.idx] === undefined) {
                        elem[key.value][key.idx] = {};
                    }
                }
            }
            elem = (key.idx === undefined) ? elem[key.value] : elem[key.value][key.idx];
        }
        return elem;
    }

    static getKeyIndex(key: string): { value: string, idx: number } {
        let aKey: string;
        let aIdx: number;
        if (key.indexOf('[') === -1) {
            aKey = key;
        } else {
            const tmpPath = key.split('[');
            aKey = tmpPath[0];
            aIdx = Number.parseInt(tmpPath[1], 10);
            if (isNaN(aIdx)) {
                aIdx = undefined;
            }
        }
        return { value: aKey, idx: aIdx };
    }

    static deepUpdate(target: any, source: any) {
        if (source instanceof Array) {
            if (!target) {
                target = [];
            }
            target = source.map((elem, idx) => EosUtils.deepUpdate(target[idx], elem));
        } else if (source instanceof Object) {
            if (!target) {
                target = {};
            }
            Object.keys(source).forEach((key) => {
                if (key.indexOf('_') !== 0) { // ignore _* properties
                    target[key] = EosUtils.deepUpdate(target[key], source[key]);
                }
            });
        } else {
            if (source !== undefined) {
                target = source;
            }
        }
        return target;
    }

    static getControlErrorMessage(control: AbstractControl, params: any): string {
        let msg = '';
        if (control && control.errors) {
            msg = Object.keys(control.errors)
                .map((key) => {
                    switch (key) {
                        case 'wrongDate':
                        case 'pattern':
                        case 'required':
                            return INPUT_ERROR_MESSAGES[key];
                        case 'maxlength':
                            return 'Максимальная длина ' + params.maxLength + ' символ(а|ов).';
                        case 'dateCompare':
                            return control.errors[key];
                    }
                })
                .join(' ');
        }
        return msg;
    }

    static isValidDate(d) {
        return d instanceof Date && !isNaN(d.getTime());
    }

}
