import { AbstractControl } from '@angular/forms';
import { INPUT_ERROR_MESSAGES } from '../consts/common.consts';
import { IPaginationUpdate } from '../../eos-common/interfaces/interfaces';
export class EosUtils {
    static pad(n: number): string {
        return n < 10 ? '0' + n : '' + n;
    }

    static dateToString(d: Date): string {
        if (d instanceof Date) {
            return d.getFullYear() +
                '-' + EosUtils.pad(d.getMonth() + 1) +
                '-' + EosUtils.pad(d.getDate())
                + 'T00:00:00';

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
                        case 'minDate':
                        case 'maxDate':
                        case 'pattern':
                        case 'required':
                        case 'errorPattern':
                            return INPUT_ERROR_MESSAGES[key];
                        case 'isUnique':
                            return INPUT_ERROR_MESSAGES[key][(params.uniqueInDict ? 1 : 0)];
                        case 'maxlength':
                            return 'Максимальная длина ' + params.maxLength + ' ' + EosUtils.endingByNumber(params.maxLength);
                        case 'valueError':
                        case 'dateCompare':
                            return control.errors[key];
                        case 'unique':
                            return INPUT_ERROR_MESSAGES[key]
                        default:
                            // console.warn('unhandled error key', key);
                            return INPUT_ERROR_MESSAGES.default;
                    }
                })
                .join(' ');
        }
        return msg;
    }

    static getValidateMessages(inputs: any): string[] {
        const invalid = [];

        for (const inputKey of Object.keys(inputs)) {
            const input = inputs[inputKey];
            const inputDib = input.dib;
            if (!inputDib) {
                continue;
            }
            const control = inputDib.control;
            if (control.invalid) {
                const title = input.label;
                control.updateValueAndValidity();
                // костыль для отображения сообщения об ошибке, при асинхронном валидаторе updateValueAndValidity затирает ошибку
                if (input.key === 'rec.CABINET_NAME' && control.errors === null) {
                    control.errors = {isUnique: true};
                }
                const validateMessage = EosUtils.getControlErrorMessage(control, { maxLength: input.length, uniqueInDict: !!input.uniqueInDict });
                invalid.push(title + ' (' + validateMessage + ')');
            }
        }
        return invalid;
    }

    static endingByNumber(value: number) {
        const mod100 = value % 100;

        if (mod100 >= 10 && mod100 <= 20) {
            return 'символов';
        }

        const mod10 = value % 10;
        switch (mod10) {
            case 1:
                return 'символ';
            case 2:
            case 3:
            case 4:
                return 'символа';
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 0:
            default:
                return 'символов';
        }

    }

    static isValidDate(d): boolean {
        return d instanceof Date && !isNaN(d.getTime());
    }

    static isDateEqual(d1: Date, d2: Date): boolean {
        return (d1.getDate() === d2.getDate()) && (d1.getFullYear () === d2.getFullYear()) && (d1.getMonth () === d2.getMonth());
    }

    static isObjEmpty(v): boolean {
        if (!v) { return true; }
        for (const key in v) {
            if (v.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    static updatePagination(config, buttonsTotal: number): IPaginationUpdate {
        let pageCount: number = 0;
        const pages: number[] = [];
        if (config.length > 0) { // включена пагинация
            let total = Math.ceil(config.itemsQty / config.length);
            if (total === 0) { total = 1; }
            const firstSet = buttonsTotal - config.current;
            const lastSet = total - buttonsTotal + 1;
            const middleSet = buttonsTotal - 3;
            pageCount = total;
            for (let i = 1; i <= pageCount; i++) {
                if (
                    i === 1 || i === pageCount || // first & last pages
                    (1 < firstSet && i < buttonsTotal) || // first 4 pages
                    (1 < config.current - lastSet && i - lastSet > 0) || // last 4 pages
                    (middleSet > config.current - i && i - config.current < middleSet)  // middle pages
                ) {
                    pages.push(i);
                }
            }
        } else { // включено отображение всех элементов
            pageCount = 1;
            pages.push(1);
        }
        return { pageCount, pages};
    }

    static removeUselessStyles(attribute: string, value?: string): void{
        const head = document.querySelector('head')
        const styles = Array.from(head.querySelectorAll('style'))
        const uselessStyles = styles.filter(tag => {
            if(value) return tag.hasAttribute(attribute) && tag.getAttribute(attribute) === value
            else return tag.hasAttribute(attribute)
        })
        uselessStyles.forEach(tag => tag.remove())
    }

    static async wait(delay: number): Promise<boolean> {
       return await new Promise(res => setTimeout(() => res(true), delay))
    }
}
