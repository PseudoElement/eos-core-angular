import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})

export class ShowTooltipService {
    constructor() {}
    calcIsDisabled(elem: HTMLElement, text: string): boolean {
        if (text === '...' ) {
            return true;
        } else if (elem.offsetWidth - text.length * 9 > 0 ) {
            return true;
        } else {
            return false;
        }
    }
}
