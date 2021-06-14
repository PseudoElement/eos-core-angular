import { DATE_INPUT_PATERN } from '../../../eos-common/consts/common.consts';
import { FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, OnChanges, Injector, ViewChild, Input, EventEmitter, Output } from '@angular/core';
// import { BsLocaleService } from 'ngx-bootstrap';
import { InputControlService } from 'eos-common/services/input-control.service';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { IBaseInput } from 'eos-common/interfaces';
import { PipRX, CALENDAR_CL } from 'eos-rest';
import { EosDatepickerInlineComponent } from '../eos-datepicker-inline/eos-datepicker-inline.component';
import { SUCCESS_SAVE } from 'eos-dictionaries/consts/messages.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IDictFormBase } from '../dict-form-base.interface';
import { EosUtils } from 'eos-common/core/utils';
import { CalendarHelper, CALENDAR_CL_BY_DEP } from 'eos-dictionaries/helpers/calendars.helper';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';

enum dayType {
    holiday = 1,
    weekend = 2,
    workday = 3,
}

const TEST_INPUTS = <IBaseInput[]>[
    {
        controlType: 'date',
        key: 'dateString',
        label: '',
        required: true,
        pattern: DATE_INPUT_PATERN,
        hideLabel: true,
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
    selector: 'eos-calendar-form',
    templateUrl: './calendar-form.component.html',
    styleUrls: ['./calendar-form.component.scss']
})

export class CalendarFormComponent implements OnInit, OnChanges, IDictFormBase {
    @ViewChild('datepicker') datepicker: EosDatepickerInlineComponent;
    @Output() onSaveChanges: EventEmitter<any> = new EventEmitter<any>();
    @Input() due = null;

    form: FormGroup;
    inputs: InputBase<any>[];

    selectedDate = new Date();
    dbDates: CalendarRecord[];

    bsDatepickerCfg: BsDatepickerConfig = Object.assign(new BsDatepickerConfig(), {
        showWeekNumbers: false,
        containerClass: 'theme-dark-blue',
        todayHighlight: true,
        dateInputFormat: 'DD.MM.YYYY',
        minDate: new Date('01/01/1753'),
        maxDate: new Date('12/31/2999'),
    });

    tbody: Element;

    private _apiSrv: PipRX;
    private _manualUpdating: boolean;
    private _msgSrv: EosMessageService;
    private _formHasChanges: boolean = false;

    constructor(
        // private localeService: BsLocaleService,
        private inputCtrlSrv: InputControlService,
        private _erorSrv: ErrorHelperServices,
        injector: Injector,
    ) {
        this._apiSrv = injector.get(PipRX);
        this.inputs = this.inputCtrlSrv.generateInputs(TEST_INPUTS);
        this._msgSrv = injector.get(EosMessageService);

        this.form = this.inputCtrlSrv.toFormGroup(this.inputs, false);
        this.form.controls['dateString'].setValue(this.selectedDate);
        this.form.valueChanges.subscribe((ch) => {
            if (this._manualUpdating) {
                return;
            }
            this.setTypeFor(Number(ch['type']), this.datepicker.value);
        });

    }

    hasChanges(): boolean {
        return this._formHasChanges;
    }

    doSave(): Promise<boolean> {
        return this._save();
    }

    ngOnInit() {
        // this.localeService.use('ru');

        this.form.valueChanges.subscribe((data) => {
            if (this.form.controls['dateString'].invalid) {
                return;
            }
            if (this.selectedDate !== data.dateString && EosUtils.isValidDate(data.dateString)) {
                this.datepicker.value = data.dateString;
            }
        });
    }

    ngOnChanges() {
    }

    setTypeFor(type: number, date: Date) {
        const d = this._toDBFormattedDate(date);
        let t = this.dbDates && this.dbDates.find(v => String(v.DATE_CALENDAR) === d);
        if (t) {
            t.DATE_TYPE = type;
            t.isChanged = true;
        } else {
            t = { ISN_CALENDAR: -1, DATE_CALENDAR: d, DATE_TYPE: type, isChanged: true };
            if (this.dbDates) {
                this.dbDates.push(t);
            }
        }
        this._formHasChanges = true;
        this.datepicker._repaint();
    }

    onDateChange(date) {
        if (this.form.controls['dateString'].invalid) {
            return;
        }
        if (!this.dbDates) {
            this._refreshDB();
        } else {
            this.selectedDate = date;
            this._updateControlsFor(date);
        }
    }

    onDataMouseMove($event) {
    }

    onClear() {
        this._refreshDB();
        this._formHasChanges = false;
    }

    onBlurDate(obj) {
        if (obj) {
            if (obj.control.invalid) {
                this._updateControlsFor(this.selectedDate);
            }
        }
    }

    onSave() {
        this._save().then( () => {
            this.onSaveChanges.emit();
        }).catch(e => {
            this._formHasChanges = false;
            this._erorSrv.errorHandler(e);
        });
    }

    setToday() {
        this.datepicker.value = new Date();
    }

    getClassForDate() {
        return this._getClassForDate.bind(this);
    }

    private _getClassForDate(date: Date) {
        if (!this.dbDates) {
            return null;
        }
        const text_date = this._toDBFormattedDate(date);
        const t = this.dbDates.find(v => String(v.DATE_CALENDAR) === text_date);
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

    private _save(): Promise<boolean> {
        return this._readDBSaved().then((storedData) => {
            const toSaveList = this.dbDates.filter(r => r.isChanged);
            const changes = this._calcChanges(storedData, toSaveList);
            if (changes) {
                return this._apiSrv.batch(changes, '')
                    .then(() => {
                        this._refreshDB();
                        this._formHasChanges = false;
                        this._msgSrv.addNewMessage(SUCCESS_SAVE);
                        return true;
                    })
                    .catch((err) => {
                        this._formHasChanges = false;
                        this._erorSrv.errorHandler(err);
                     //   this._msgSrv.addNewMessage({ msg: err.message, type: 'danger', title: 'Ошибка записи' });
                        return false;
                    });
            } else {
                return true;
            }
        });
    }

    private _refreshDB() {
        this._readDBSaved().then((data) => {
            if (this.due) {
                data.forEach( (rec) => {
                    if (this.due !== rec.OWNER_ID) {
                        rec.ISN_CALENDAR = -1; /* mark as not Inserted */
                        rec.OWNER_ID = this.due;
                        rec.isChanged = true;
                    }
                });
            }
            this.dbDates = data;
            this._updateControlsFor(this.selectedDate);
            this.datepicker._repaint();
            return data;
        });
    }

    private _calcChanges(storedData: CALENDAR_CL_BY_DEP[], toSaveList: CalendarRecord[]): any[] {
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
                // ненужная запись - описывает то что и так ясно из календаря (выходной\будний совпадает)
                if (rec.ISN_CALENDAR === -1) {
                    // ненужная запись - просто натыкали, игнорируем, в БД отсутствует
                    continue;
                } else {
                    // ненужная запись - удалить из БД
                    changes.push({
                        method: 'DELETE',
                        data: '',
                        requestUri: 'CALENDAR_CL(' + rec.ISN_CALENDAR + ')',
                    });
                }
            } else {
                // Нужная запись
                let saved_rec = null;


                const data = { DATE_CALENDAR: rec.DATE_CALENDAR, DATE_TYPE: rec.DATE_TYPE };
                if (this.due) {
                    data['OWNER_ID'] = this.due;
                    saved_rec = storedData.find(r => r.ISN_CALENDAR === rec.ISN_CALENDAR && r.OWNER_ID === this.due);
                } else {
                    saved_rec = storedData.find(r => r.ISN_CALENDAR === rec.ISN_CALENDAR);
                }


                if (saved_rec) {
                    if (saved_rec.DATE_TYPE === rec.DATE_TYPE) {
                        continue;
                    } else {
                        changes.push({
                            method: 'MERGE',
                            data: data,
                            requestUri: 'CALENDAR_CL(' + rec.ISN_CALENDAR + ')',
                        });
                    }
                } else {
                    changes.push({
                        method: 'POST',
                        data: data,
                        requestUri: 'CALENDAR_CL',
                    });
                }
            }
        }
        return changes;
    }

    private _updateControlsFor(date: Date) {

        this._manualUpdating = true;

        this.form.controls['dateString'].setValue(date);

        const d = this._toDBFormattedDate(date);

        const t = this.dbDates && this.dbDates.find(v => String(v.DATE_CALENDAR) === d);

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

    private _toDBFormattedDate(date: Date) {
        return (date.getFullYear() + '-'
            + ('0' + (date.getMonth() + 1)).slice(-2)
            + '-' + ('0' + (date.getDate())).slice(-2))
            + 'T00:00:00';
    }

    private _readDBSaved(): Promise<any> {
        return CalendarHelper.readDB(this._apiSrv, this.due).catch(e => {
            this._formHasChanges = false;
            this._erorSrv.errorHandler(e);
        });
    }

}
