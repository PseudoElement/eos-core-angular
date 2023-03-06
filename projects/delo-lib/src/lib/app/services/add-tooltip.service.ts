import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})

export class ShowTooltipService {
    constructor() {}
    someMethod(elem: HTMLElement, text: string) {
        if (text === '...' ) {
            return true;
        } else if (elem.offsetWidth - text.length * 9 > 0 ) {
            return true;
        } else {
            return false;
        }
    }
}
