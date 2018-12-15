import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Input, Output, EventEmitter
@Component({
    selector: 'eos-email-form',
    styleUrls: ['email-form.component.scss'],
    templateUrl: 'email-form.component.html'
})
export class EmailFormComponent  implements OnInit {

    @Input() checkedParams: string;
    @Input() code: Map<string, string>;
    @Output() sendParams = new EventEmitter<any>();
    public inputsInfo: any;
    public storeParams = new Set();
    constructor() {

    }
    ngOnInit() {
      this.ArrayCh();
    }

    parseParams() {
        if (this.checkedParams !== null || '') {
               this.checkedParams.split(';').forEach(el => {
                this.storeParams.add(el.trim());
        });
        }

        return this.storeParams;
    }

    ArrayCh() {
        const newArr = [];
        let newOb = {};
        const setr = this.parseParams();
        const codeFrom = Array.from(this.code);
        codeFrom.forEach(el => {
            newOb['name'] = el[1];
            if ( setr.has(el[1])) {
                newOb['check'] = false;
            }else {
                newOb['check'] = true;
            }
            newArr.push(newOb);
            newOb = {};
        });
        this.inputsInfo = newArr;
    }
    saveParams(event, name) {
        if (!event.target.checked && !this.storeParams.has(name)) {
            this.storeParams.add(name);
            }
            if (event.target.checked && this.storeParams.has(name)) {
                    this.storeParams.delete(name);
            }
           this.sendParams.emit(this.storeParams);
    }
}
