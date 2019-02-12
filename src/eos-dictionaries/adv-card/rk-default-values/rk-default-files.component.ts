import { AdvCardRKDataCtrl } from './../adv-card-rk-datactrl';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-files',
    templateUrl: 'rk-default-files.component.html',
})

export class RKFilesCardComponent implements OnChanges {
    @Input() dataController: AdvCardRKDataCtrl;
    @Input() fieldsDescription: any;
    @Input() data: any;
    @Input() inputs: any;
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
