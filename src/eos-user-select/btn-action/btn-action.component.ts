import { Component, Input, OnInit} from '@angular/core';
import {BtnAction} from '../shered/interfaces/btn-action.interfase';
@Component({
    selector: 'eos-btn-action',
    templateUrl: 'btn-action.component.html',
    styleUrls: ['btn-action.component.scss'],
})

export class BtnActionComponent implements OnInit {

    @Input() buttons: BtnAction;

    constructor() {
    }
    ngOnInit() {
        console.log(this.buttons);
    }
    doAction(event) {
        console.log(event);
    }
}
