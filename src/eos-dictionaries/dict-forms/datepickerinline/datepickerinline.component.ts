import { DATE_INPUT_PATERN } from './../../../eos-common/consts/common.consts';
import { FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, OnChanges, Injector, ViewChild } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap';
import { InputControlService } from 'eos-common/services/input-control.service';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { IBaseInput } from 'eos-common/interfaces';
import { EosUtils } from 'eos-common/core/utils';
import { PipRX, CALENDAR_CL } from 'eos-rest';
import { EosDatepickerInlineComponent } from '../eos-datepicker-inline/eos-datepicker-inline.component';
import { SUCCESS_SAVE } from 'eos-dictionaries/consts/messages.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';


enum dayType {
    holiday = 1,
    weekend = 2,
    workday = 3,
}

const TEST_INPUTS = <IBaseInput[]>[
{
    controlType: 'string',
    key: 'dateString',
    label: 'string',
    required: true,
    pattern: DATE_INPUT_PATERN,
}, {
    controlType: 'select',
    key: 'type',
    label: 'день',
    options: [{
        value: dayType.holiday,
        title: 'Праздник'
    }, {
        value: dayType.weekend,
        title: 'Выходной'
    }, {
        value: dayType.workday,
        title: 'Рабочий день'
    }]
}, ];

interface CalendarRecord extends CALENDAR_CL {
    isChanged?: boolean;
}
@Component({
  selector: 'eos-datepickerinline',
  templateUrl: './datepickerinline.component.html',
  styleUrls: ['./datepickerinline.component.scss']
})

export class DatepickerinlineComponent implements OnInit, OnChanges {

    @ViewChild('datepicker') datepicker: EosDatepickerInlineComponent;


    bsInlineValue = new Date();
    form: FormGroup;
    inputs: InputBase<any>[];

    selectedDate;
    dbDates: CalendarRecord[];

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
    private _manualUpdating: boolean;
    private _msgSrv: EosMessageService;

    constructor(
        private localeService: BsLocaleService,
        private inputCtrlSrv: InputControlService,
        injector: Injector,
        ) {
            this._apiSrv = injector.get(PipRX);
            this.inputs = this.inputCtrlSrv.generateInputs(TEST_INPUTS);
            this._msgSrv = injector.get(EosMessageService);

            this.form = this.inputCtrlSrv.toFormGroup(this.inputs, false);
            this.form.valueChanges.subscribe((ch) => {
                if (this._manualUpdating) {
                    return;
                }
                this.setTypeFor(Number(ch['type']), this.datepicker.value);
            });

    }

    ngOnInit() {
        this.localeService.use('ru');
        this.selectedDate = this.bsInlineValue;


    }


    ngOnChanges() {
    }

    setTypeFor(type: number, date: Date) {
        const d = this._toDBFormattedDate(date);
        let t = this.dbDates.find( v => String(v.DATE_CALENDAR) === d);
        if (t) {
            t.DATE_TYPE = type;
            t.isChanged = true;
        } else {
            t = { ISN_CALENDAR: -1, DATE_CALENDAR: d, DATE_TYPE: type, isChanged: true };
            this.dbDates.push(t);
        }
        this.datepicker._repaint();
    }

    onDateChange(date) {
        if (!this.dbDates) {
            this.refreshDB();
        } else {
            this.selectedDate = date;
            this._updateControlsFor(date);
        }
    }

    onDataMouseMove($event) {
       // this._updateCalendar();
    }

    onClear() {
        this.refreshDB();
    }

    onSave() {
        this._readDBSaved().then((storedData) => {
            const toSaveList = this.dbDates.filter(r => r.isChanged);
            const changes = this._calcChanges(storedData, toSaveList);
            if (changes) {
                this._apiSrv.batch(changes, '')
                    .then(() => {
                        this.refreshDB();

                        this._msgSrv.addNewMessage(SUCCESS_SAVE);
                    })
                    .catch((err) => {
                        this._msgSrv.addNewMessage({ msg: err.message, type: 'danger', title: 'Ошибка записи' });
                    });
            }

        });
    }

    _calcChanges(storedData: CALENDAR_CL[], toSaveList: CalendarRecord[]): any[] {
        const changes = [];

        for (let i = 0; i < toSaveList.length; i++) {
            const rec = toSaveList[i];
            const date: Date = new Date(rec.DATE_CALENDAR);
            const type = Number(rec.DATE_TYPE);
            const dayOfWeek = date.getDay();
            const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

            if ((isWeekend && type === dayType.weekend) ||
                (!isWeekend && type === dayType.workday)
            ) {
                // ненужная запись - описывает то что и так ясно из календаря
                if (rec.ISN_CALENDAR === -1) {
                    // ненужная запись - просто натыкали, игнорируем, в БД отсутствует
                    continue;
                } else {
                    // ненужная запись - удалить из БД
                    changes.push ({
                        method: 'DELETE',
                        data: '',
                        requestUri: 'CALENDAR_CL(' + rec.ISN_CALENDAR + ')',
                    });
                }
            } else {
                // Нужная запись
                const saved_rec = storedData.find(r => r.ISN_CALENDAR === rec.ISN_CALENDAR);
                if (saved_rec) {
                    if (saved_rec.DATE_TYPE === rec.DATE_TYPE) {
                        continue;
                    } else {
                        changes.push ({
                            method: 'MERGE',
                            data:  { DATE_CALENDAR: rec.DATE_CALENDAR, DATE_TYPE: rec.DATE_TYPE },
                            requestUri: 'CALENDAR_CL(' + rec.ISN_CALENDAR + ')',
                        });
                    }
                } else {
                    changes.push ({
                        method: 'POST',
                        data:  { DATE_CALENDAR: rec.DATE_CALENDAR, DATE_TYPE: rec.DATE_TYPE },
                        requestUri: 'CALENDAR_CL',
                    });
                }
            }


        }
        return changes;
    }


    // left private _calcChangesFor(docGroup: any, newData: any ): any {
    //     const fields = this.getDescriptions();
    //     const changes = [];
    //     if (!newData) {
    //         return null;
    //     }
    //     this.keys(newData[FILE_CONSTRAINT_LIST_NAME]).forEach((key) => {
    //         const savedData = docGroup[FILE_CONSTRAINT_LIST_NAME].find (f => f.CATEGORY === key);
    //         let hasChanges = false;
    //         for (const sk in RKFilesConstraintsFields) {
    //             if (RKFilesConstraintsFields.hasOwnProperty(sk)) {

    //                 const f = RKFilesConstraintsFields[sk];
    //                 const spath = key + '.' + f;
    //                 const field = fields[FILE_CONSTRAINT_LIST_NAME].find(i => i.key === spath);
    //                 const type: E_FIELD_TYPE = field.type;
    //                 const t1 = newData[FILE_CONSTRAINT_LIST_NAME];
    //                 const t2 = t1[key];
    //                 const savedValue = this.fixDBValueByType(savedData[f], type);
    //                 const formValue = this.fixDBValueByType(t2[f], type);
    //                 if (savedValue !== formValue) {
    //                     hasChanges = true;
    //                     break;
    //                 }
    //             }
    //         }

    //         const updatevalues = {};
    //         for (const sk in RKFilesConstraintsFields) {

    //             if (RKFilesConstraintsFields.hasOwnProperty(sk)) {
    //                 const f = RKFilesConstraintsFields[sk];
    //                 const spath = key + '.' + f;
    //                 const field = fields[FILE_CONSTRAINT_LIST_NAME].find(i => i.key === spath);
    //                 const type: E_FIELD_TYPE = field.type;
    //                 const t1 = newData[FILE_CONSTRAINT_LIST_NAME];
    //                 const t2 = t1[key];
    //                 updatevalues[f] = this.fixDBValueByType(t2[f], type);
    //             }
    //         }
    //         if (updatevalues['ONE_FILE'] === null) {
    //             updatevalues['ONE_FILE'] = '0';
    //         }

    //         if (hasChanges) {
    //             if (savedData) {

    //                 changes.push (
    //                     {
    //                         method: 'MERGE',
    //                         data: updatevalues,
    //                         requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DG_FILE_CONSTRAINT_List(\''
    //                             + docGroup['DUE'] + ' ' + key + '\')'
    //                     }
    //                 );
    //             } else {
    //                 updatevalues['CATEGORY'] = key;
    //                 changes.push (
    //                     {
    //                         method: 'POST',
    //                         data: updatevalues,
    //                         requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DG_FILE_CONSTRAINT_List'
    //                     }
    //                 );
    //             }
    //         }


    //     });

    //     this.keys(newData[DEFAULTS_LIST_NAME]).forEach((key) => {
    //         const savedData = docGroup[DEFAULTS_LIST_NAME].find (f => f.DEFAULT_ID === key);
    //         const field = fields[DEFAULTS_LIST_NAME].find(i => i.key === key);
    //         const type: E_FIELD_TYPE = field.type;
    //         const newValue = this.fixDBValueByType(newData[DEFAULTS_LIST_NAME][key], type);
    //         if (savedData) {
    //             const savedValue = this.fixDBValueByType(savedData.VALUE, type);
    //             if (savedValue !== newValue) {
    //                 if (!this._isNeedToStoreByType(newValue, type)) {
    //                     changes.push (
    //                         {
    //                             method: 'DELETE',
    //                             data: '',
    //                             requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DOC_DEFAULT_VALUE_List(\''
    //                                 + docGroup['DUE'] + ' ' + savedData['DEFAULT_ID'] + '\')'
    //                         }
    //                     );
    //                 } else {
    //                     changes.push (
    //                         {
    //                             method: 'MERGE',
    //                             data: {VALUE: String(newValue) },
    //                             requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DOC_DEFAULT_VALUE_List(\''
    //                                 + docGroup['DUE'] + ' ' + savedData['DEFAULT_ID'] + '\')'
    //                         }
    //                     );
    //                 }
    //             }
    //         } else if (newValue) {
    //             if (this._isNeedToStoreByType(newValue, type)) {
    //                 changes.push (
    //                     {
    //                         method: 'POST',
    //                         data: { VALUE: String(newValue), DEFAULT_ID: key },
    //                         requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DOC_DEFAULT_VALUE_List'
    //                     }
    //                 );
    //             }
    //         }
    //     });
    //     return changes;
    // }


    refreshDB() {
        this._readDBSaved().then((data) => {
            this.dbDates = data;
            console.log(this.selectedDate);
            this._updateControlsFor(this.selectedDate);
            this.datepicker._repaint();
            return data;
        });
    }

    getClassForDate (date: Date) {
        if (!this.dbDates) {
            return null;
        }
        const text_date = this._toDBFormattedDate(date);
        const t = this.dbDates.find( v => String(v.DATE_CALENDAR) === text_date);
        if (t) {
            if (t.DATE_TYPE === dayType.weekend || t.DATE_TYPE === dayType.holiday) {
                return 'typeweekend';
            }
        } else {
            const dw = date.getDay();
            if (dw === 0 || dw === 6) {
                return 'typeweekend';
            }
        }

        return null;
    }

    private _updateControlsFor(date: Date) {

        this._manualUpdating = true;

        this.form.controls['dateString'].setValue(EosUtils.dateToStringValue(date));

        const d = this._toDBFormattedDate(date);

        const t = this.dbDates.find( v => String(v.DATE_CALENDAR) === d);

        if (t) {
            this.form.controls['type'].setValue(t.DATE_TYPE);
        } else {
            const wd = date.getDay();
            if (wd === 6 || wd === 0) {
                this.form.controls['type'].setValue(dayType.weekend);
            } else {
                this.form.controls['type'].setValue(dayType.workday);
            }
        }

        this._manualUpdating = false;

    }



    private _toDBFormattedDate (date: Date) {
        return (date.getFullYear() + '-'
            + ('0' + (date.getMonth() + 1)).slice(-2)
            + '-' + ('0' + (date.getDate())).slice(-2))
            + 'T00:00:00';
    }

    private _readDBSaved(): Promise<any> {
        const query = {
            // criteries: { ['CALENDAR_CL']: String(uid) },
        };

        const req: any = {
            ['CALENDAR_CL']: query,
            orderby: 'DATE_CALENDAR',
            // expand: DEFAULTS_LIST_NAME + ',' + FILE_CONSTRAINT_LIST_NAME,
            foredit: true,
        };

        return this._apiSrv.read<CALENDAR_CL>(req);
    }


}
