import { DATE_INPUT_PATERN } from './../../../eos-common/consts/common.consts';
import { FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, OnChanges, Injector } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap';
import { InputControlService } from 'eos-common/services/input-control.service';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { IBaseInput } from 'eos-common/interfaces';
import { EosUtils } from 'eos-common/core/utils';
import { PipRX, CALENDAR_CL } from 'eos-rest';



const TEST_INPUTS = <IBaseInput[]>[
{
    controlType: 'select',
    key: 'type',
    label: 'день',
    options: [{
        value: 1,
        title: 'Праздник'
    }, {
        value: 2,
        title: 'Выходной'
    }, {
        value: 3,
        title: 'Рабочий день'
    }]
}, {
    controlType: 'string',
    key: 'dateString',
    label: 'string',
    required: true,
    pattern: DATE_INPUT_PATERN,
}, ];

@Component({
  selector: 'eos-datepickerinline',
  templateUrl: './datepickerinline.component.html',
  styleUrls: ['./datepickerinline.component.scss']
})

export class DatepickerinlineComponent implements OnInit, OnChanges {

    // @ViewChild('item1') item1: BsDatepickerInlineDirective;


    bsInlineValue = new Date();
    form: FormGroup;
    inputs: InputBase<any>[];

    selectedDate;
    dbDates: CALENDAR_CL[];

    bsDatepickerCfg: BsDatepickerConfig = Object.assign(new BsDatepickerConfig(), {
        showWeekNumbers: false,
        containerClass: 'theme-dark-blue',
        todayHighlight: true,
        dateInputFormat: 'DD.MM.YYYY',
        minDate: new Date('01/01/1900'),
        maxDate: new Date('12/31/2100'),
    });


    // @ViewChild(cd) private cd: BsDatepickerModule;

    tbody: Element;
    private _apiSrv: PipRX;

    constructor(
        private localeService: BsLocaleService,
        private inputCtrlSrv: InputControlService,
        injector: Injector,
        ) {
            this._apiSrv = injector.get(PipRX);
            this.inputs = this.inputCtrlSrv.generateInputs(TEST_INPUTS);
            ;
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs, false);
            this.form.valueChanges.subscribe(() => {
                // this.data = data;
            });

    }

    ngOnInit() {
        this.localeService.use('ru');
        this.selectedDate = this.bsInlineValue;

        setTimeout(() => {
            // this._updateCalendar();
        }, 100);
    }


    ngOnChanges() {
    }

    onDateChange(date) {
        if (!this.dbDates) {
            this._refreshSaved(date);
        } else {
            this._updateControlsFor(date);
        }
        console.log(date);
    }

    onDataMouseMove($event) {
       // this._updateCalendar();
    }


    getClassForDate (date: Date) {
        return 'typeweekend';
    }
    private _updateControlsFor(date: Date) {

        this.form.controls['dateString'].setValue(EosUtils.dateToStringValue(date));

        const d = this._toDBFormattedDate(date);

        const t = this.dbDates.find( v => String(v.DATE_CALENDAR) === d);

        if (t) {
            this.form.controls['type'].setValue(t.DATE_TYPE);
        } else {
            const wd = date.getDay();
            if (wd === 6 || wd === 0) {
                this.form.controls['type'].setValue(2);
            } else {
                this.form.controls['type'].setValue(3);
            }
        }

    }

    // private _updateCalendar() {
    //     let v = document.getElementById('bsdatp');
    //     if (v) {
    //         let v1 = v.children[0].children[0].children[0].children[0].children[0].children[0].children[0];
    //         if (v1) {
    //             this.tbody = v1.children[1].children[0].children[1];
    //         }
    //     }

    //     if (!this.tbody) {
    //         return;
    //     }

    //     // console.log(tbody);
    //     for (let irow = 0; irow < this.tbody.children.length; irow++) {
    //         const row = this.tbody.children[irow];
    //         for (let itd = 0; itd < row.children.length; itd++) {
    //             const td = row.children[itd];
    //             if (td.classList.contains('disabled')) {

    //             } else {
    //                 // console.log(td);
    //                 // console.log (this.item);
    //                 // const date = this._dateByCoord(irow, itd, );
    //                 td.classList.add('typeweekend');
    //             }
    //         }
    //     }
    // }

    private _toDBFormattedDate (date: Date) {
        return (date.getFullYear() + '-'
            + ('0' + (date.getMonth() + 1)).slice(-2)
            + '-' + ('0' + (date.getDate())).slice(-2))
            + 'T00:00:00';
    }

    private _refreshSaved(selectedDate: any) {
        const query = {
            // criteries: { ['CALENDAR_CL']: String(uid) },
        };

        const req: any = {
            ['CALENDAR_CL']: query,
            orderby: 'DATE_CALENDAR',
            // expand: DEFAULTS_LIST_NAME + ',' + FILE_CONSTRAINT_LIST_NAME,
            foredit: true,
        };

        return this._apiSrv.read<CALENDAR_CL>(req).then((data) => {
            this.dbDates = data;
            this._updateControlsFor(this.selectedDate);
            return data;
        });
    }


}
