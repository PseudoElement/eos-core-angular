import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExtendProtocolLib {
    constructor(
    ) {}
    public isnRefFile;
    public getButtons() {
        return [
            {
                disabled: () => this.isnRefFile === undefined,
                tooltip: 'Просмотреть',
                icon: 'eos-icon-open-read-only-blue',
                click: () => this.GetRefFile()
            }
        ]
    } 
    private GetRefFile() {
        setTimeout(() => {
            window.open(`../getfile.aspx/${this.isnRefFile}/3x.html`, '_blank', 'width=900, height=700, scrollbars=1');
        }, 0);
    }
}