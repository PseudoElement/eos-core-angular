import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { LOGGINGS_PARAM } from '../shared/consts/logging-consts';
import { PipRX, USER_PARMS } from 'eos-rest';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
// import { PipRX, USER_PARMS } from 'eos-rest';
// import { FormGroup } from '@angular/forms';

@Component({
    selector: 'eos-param-logging',
    templateUrl: 'param-logging.component.html'
})
export class ParamLoggingComponent extends BaseParamComponent implements OnInit {
    @Input() btnError;
    public masDisable: any[] = [];
    constructor( injector: Injector, private pip: PipRX
    ) {
        super( injector, LOGGINGS_PARAM);
    }
    ngOnInit() {
       this.initProt();
    }

    initProt(): Promise<any> {
        this.prepareDataParam();
        return  this.pip.read<USER_PARMS>({
            USER_PARMS: PipRX.criteries({ 'PARM_NAME': 'USER_EDIT_AUDIT|VIEWPROT' })
          })
            .then(data => {
                this.prepareData = this.convData(data);
                this.inputs = this.dataSrv.getInputs(this.prepInputs, this.parseDataInit(this.prepareData));
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.subscribeChangeForm();
                this.cancelEdit();
            })
            .catch(err => {
                throw err;
            });
    }

    edit() {
        // проверяем право доступа "Текущая организация"
        // дизейблим блок Настройка протокола просмотра
        const techRights = this._appContext.CurrentUser.TECH_RIGHTS;
        if (!techRights || techRights.charAt(29) === '0') {
            this.masDisable = this.masDisable.filter((field) => field === 'rec.USER_EDIT_AUDIT');
        }
        // проверяем ограниченность технолога
        // дизейблим Протоколирование работы со справочником пользователи
        if (!techRights || techRights.charAt(0) === '0' || this._appContext.limitCardsUser.length) {
            this.masDisable = this.masDisable.filter((field) => field !== 'rec.USER_EDIT_AUDIT');
        }
        if (this.masDisable.length) {
            Object.keys(this.form.controls).forEach(key => {
                if (this.masDisable.indexOf(key) >= 0) {
                    this.form.controls[key].enable({ emitEvent: false });
                }
            });
        }
    }
    parseDataInit(data: any) {
        const dataInput = {rec: {}};
        if (data.rec.USER_EDIT_AUDIT === 'NO') {
            dataInput.rec['USER_EDIT_AUDIT'] = false;
        } else {
            dataInput.rec['USER_EDIT_AUDIT'] = true;
        }
        for (let i = 0; i <= 12; i++) {
            data.rec.VIEWPROT[i] === '1' ?  dataInput.rec[`VIEWPROT${i}`] = true : dataInput.rec[`VIEWPROT${i}`] = false;
        }
        return dataInput;
    }
    cancelEdit() {
        this.masDisable = [];
        Object.keys(this.form.controls).forEach(key => {
            if (!this.form.controls[key].disabled) {
                this.masDisable.push(key);
            }
        });
        this.form.disable({ emitEvent: false });
    }

    customRequest(strProt: string) {
        const query: any[] = [];
        let userEditAuditChange: boolean = false;
        let viewprotChange: boolean = false;
        const editUserAuditReq = {
            method: 'MERGE',
            requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 USER_EDIT_AUDIT')`,
            data: {
                PARM_VALUE: this.newData.rec['USER_EDIT_AUDIT']
            }
        };
        const viewportReq = {
            method: 'MERGE',
            requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 VIEWPROT')`,
            data: {
                PARM_VALUE: strProt
            }
        };

        if (this.newData.rec['USER_EDIT_AUDIT']) {
            userEditAuditChange = (this.newData.rec['USER_EDIT_AUDIT'] !== this.prepareData.rec['USER_EDIT_AUDIT']) ? true : false;
        }

        viewprotChange = (strProt !== this.prepareData.rec['VIEWPROT']) ? true : false;

        if (userEditAuditChange) {
            query.push(editUserAuditReq);
        }

        if (viewprotChange) {
            query.push(viewportReq);
        }

        return query;
    }

    submit() {
        let strProt = '';
        for (const key in this.newData.rec) {
            if (key !== 'USER_EDIT_AUDIT') {
                this.newData.rec[key] === 'YES' ?  strProt += '1' :  strProt += '0';
            }
        }

        const query = this.customRequest(strProt);

        this.paramApiSrv.setData(query)
            .then(() => {
                    this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this.formChanged.emit(false);
                })
            .catch(data => {
                this.formChanged.emit(true);
                this.isChangeForm = false;
                this.msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка сервера',
                    msg: data.message ? data.message : data
                });
            });
    }
    cancel() {
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.initProt();
        }
    }
}
