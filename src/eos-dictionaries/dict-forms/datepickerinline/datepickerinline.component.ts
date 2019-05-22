import { FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, OnChanges, AfterContentChecked } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap';
import { InputControlService } from 'eos-common/services/input-control.service';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { IBaseInput } from 'eos-common/interfaces';



const TEST_INPUTS = <IBaseInput[]>[{
    controlType: 'string',
    key: 'data.string',
    label: 'string',
    required: true,
    pattern: /\S+/,
    forNode: false,
    value: 'no data!!!',
}, {
    controlType: 'text',
    key: 'data.text',
    label: 'TEXT',
    required: true,
    height: '100'
}, {
    controlType: 'checkbox',
    key: 'data.checkbox',
    label: 'check me',
    // value: true
}, {
    controlType: 'select',
    key: 'data.select',
    label: 'select value',
    disabled: false,
    required: false,
    options: [{
        value: 1,
        title: 'one'
    }, {
        value: 2,
        title: 'two'
    }, {
        value: 3,
        title: 'three'
    }]
}, {
    controlType: 'date',
    key: 'data.date',
    value: new Date(),
    label: 'date'
}, {
    controlType: 'buttons',
    key: 'data.switch',
    label: 'buttons',
    options: [{
        value: 1,
        title: 'one',
    }, {
        value: 2,
        title: 'two'
    }, {
        value: 3,
        title: 'three'
    }],
    value: 1
}];

@Component({
  selector: 'eos-datepickerinline',
  templateUrl: './datepickerinline.component.html',
  styleUrls: ['./datepickerinline.component.scss']
})

export class DatepickerinlineComponent implements OnInit, OnChanges, AfterContentChecked {

    bsInlineValue = new Date();
    form: FormGroup;
    inputs: InputBase<any>[];

    bsDatepickerCfg: BsDatepickerConfig = Object.assign(new BsDatepickerConfig(), {
        showWeekNumbers: false,
        containerClass: 'theme-dark-blue',
        todayHighlight: true,
        dateInputFormat: 'DD.MM.YYYY',
        minDate: new Date('01/01/1900'),
        maxDate: new Date('12/31/2100'),
    });

    constructor(
        private localeService: BsLocaleService,
        private inputCtrlSrv: InputControlService,
        ) {
        this.inputs = this.inputCtrlSrv.generateInputs(TEST_INPUTS);
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs, false);
        this.form.valueChanges.subscribe((data) => {
            // this.data = data;
        });

    }

    ngOnInit() {
        this.localeService.use('ru');

    }

    ngAfterContentChecked() {
        // setTimeout(() => {
        // const bsdatp = document.getElementById('bsdatp');
        // console.log (bsdatp);
        // }, 100);
    }

    ngOnChanges() {
    }

    // beforeShowDay (date) {
    //     const hilightedDays = [1,3,8,20,21,16,26,30];
    //     if (~hilightedDays.indexOf(date.getDate())) {
    //        return {classes: 'highlight', tooltip: 'Title'};
    //     }
    // }


}
