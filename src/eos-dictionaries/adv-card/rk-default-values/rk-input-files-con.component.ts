import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-input-files',
    templateUrl: 'rk-input-files-con.component.html',
})

export class RKFilesConInputComponent implements OnChanges {
    @Input() title: string;
    @Input() inputSize: any;
    @Input() inputCb: any;
    @Input() inputExt: any;
    // @Input() dataController: AdvCardRKDataCtrl;
    // @Input() fieldsDescription: any;
    // @Input() data: any;
    // @Input() inputs: any;
    @Input() form: FormGroup;
    @Input() editMode: boolean;
    type: any;
    output: any;
    constructor(
        // private _dataSrv: EosDataConvertService,
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {
        // for (let propName in changes) {
        //     /*let chng = changes[propName];
        //     let cur  = JSON.stringify(chng.currentValue);
        //     let prev = JSON.stringify(chng.previousValue);
        //     this.changeLog.push(`propName: currentValue = cur, previousValue = prev`);*/
        // }
        // console.log('form:', this.form);
    }
}
