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
                icon: 'eos-adm-icon-open-read-only-blue',
                click: () => this.GetRefFile()
            }
        ]
    } 
    private GetRefFile() {
        setTimeout(() => {
            window.open(`../CoreHost/FOP/GetFile/${this.isnRefFile}/3x.html?nodownload=true`, '_blank', 'width=900, height=700, scrollbars=1');
        }, 0);
    }
}
