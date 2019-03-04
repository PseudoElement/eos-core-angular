import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdvCardRKDataCtrl } from '../adv-card-rk-datactrl';

@Component({
    selector: 'eos-rk-input-files',
    templateUrl: 'rk-input-files-con.component.html',
    styleUrls: ['./rk-input-files-con.component.scss']
})

export class RKFilesConInputComponent implements OnChanges {
    @Input() title: string;
    @Input() inputSize: any;
    @Input() inputCb: any;
    @Input() inputExt: any;
    @Input() dataController: AdvCardRKDataCtrl;
    @Input() form: FormGroup;
    @Input() editMode: boolean;
    type: any;
    output: any;
    constructor(
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {

    }
}
