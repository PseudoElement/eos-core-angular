import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PipRX, ORGANIZ_CL } from 'eos-rest';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE, } from '../shared/consts/eos-parameters.const';
import { ORGAN_PARAM } from '../shared/consts/organ-now.const';
import { IOpenClassifParams } from 'eos-common/interfaces';
import { Validators } from '@angular/forms';
@Component({
    selector: 'eos-parameters-organiz-now',
    templateUrl: 'param-org-now.component.html',
})
export class ParamOrganizNowComponent extends BaseParamComponent implements OnInit {
    @Input() btnError;
    public sys = '';
    public version = '';
    public organOld: ORGANIZ_CL;
    public masDisable: any[] = [];
    constructor( injector: Injector, private pip: PipRX
    ) {
        super( injector, ORGAN_PARAM);
    }
    ngOnInit() {
       this.initProt();
    }
    convDeloOwner(deloOwner) {
        return {rec: deloOwner};
    }
    getOrganization(node: number, add: boolean) {
        this.pip.read({ ORGANIZ_CL: {
            criteries: {
                ISN_NODE: node
            },
        } })
        .then((data: ORGANIZ_CL[]) => {
            if (data[0]) {
                this.organOld = data[0];
                this.form.controls['rec.INN'].setValue(data[0]['INN'], {emitEvent: false});
                this.form.controls['rec.ADDRES'].setValue(data[0]['ADDRESS'], {emitEvent: false});
                this.form.controls['rec.INDEX'].setValue(data[0]['ZIPCODE'], {emitEvent: false});
                this.form.controls['rec.OKPO'].setValue(data[0]['OKPO'], {emitEvent: false});
                this.form.controls['rec.OKVED'].setValue(data[0]['OKONH'], {emitEvent: false});
                this.form.controls['rec.FULLNAME'].setValue(data[0]['FULLNAME'], {emitEvent: false});
                this.form.controls['rec.NAME'].setValue(data[0]['CLASSIF_NAME'], {emitEvent: add});
                if (add && data[0]['INN'] && !this.form.controls['rec.ORG_ID'].value) {
                    this.form.controls['rec.ORG_ID'].patchValue(data[0]['INN']);
                }
            }
        })
        .catch(err => {
                throw err;
        });
    }
    getOrganizationDUE(DUE: String, add: boolean) {
        this.pip.read({ ORGANIZ_CL: {
            criteries: {
                DUE: DUE
            },
        } })
        .then((data: ORGANIZ_CL[]) => {
            if (data[0]) {
                this.organOld = data[0];
                this.form.controls['rec.INN'].setValue(data[0]['INN'], {emitEvent: false});
                this.form.controls['rec.ADDRES'].setValue(data[0]['ADDRESS'], {emitEvent: false});
                this.form.controls['rec.INDEX'].setValue(data[0]['ZIPCODE'], {emitEvent: false});
                this.form.controls['rec.OKPO'].setValue(data[0]['OKPO'], {emitEvent: false});
                this.form.controls['rec.OKVED'].setValue(data[0]['OKONH'], {emitEvent: false});
                this.form.controls['rec.FULLNAME'].setValue(data[0]['FULLNAME'], {emitEvent: false});
                this.form.controls['rec.NAME'].setValue(data[0]['CLASSIF_NAME'], {emitEvent: add});
                this.form.controls['rec.ISN_ORGANIZ'].patchValue(data[0]['ISN_LCLASSIF']);
                if (add && data[0]['INN'] && !this.form.controls['rec.ORG_ID'].value) {
                    this.form.controls['rec.ORG_ID'].patchValue(data[0]['INN']);
                }
            }
        })
        .catch(err => {
                throw err;
        });
    }
    initProt(): Promise<any> {
        this.prepareDataParam();
        return  this.pip.read({
            DELO_OWNER: -99
        })
        .then(data => {
            const DELO = data[0];
            this.prepareData = {rec: DELO};
            this.inputs = this.dataSrv.getInputs(this.prepInputs, this.prepareData);
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.form.controls['rec.NAME'].setValidators(Validators.required);
            if (data[0]['ISN_ORGANIZ']) {
                this.getOrganization(data[0]['ISN_ORGANIZ'], false);
            }
            this.sys = data[0]['SYS_NAME'];
            this.version = data[0]['SYS_VERSION'];
            this.subscribeChangeForm();
            this.cancelEdit();
            // this._subscribe();
        })
        .catch(err => {
            this.prepareData = this.convData([]);
            this.inputs = this.dataSrv.getInputs(this.prepInputs, this.prepareData);
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.subscribeChangeForm();
            this.cancelEdit();
            throw err;
        });
    }
    edit() {
        this.form.controls['rec.NAME'].enable({ emitEvent: false });
        this.form.controls['rec.ISN_ORGANIZ'].enable({ emitEvent: false });
        this.form.controls['rec.ORG_ID'].enable({ emitEvent: false });
        this.form.controls['rec.FULLNAME'].enable({ emitEvent: false });
    }
    openOrganiz() {
        if (!this.form.controls['rec.ISN_ORGANIZ'].disabled) {
            const OPEN_CLASSIF_ORGANIZ_FULL: IOpenClassifParams = {
                classif: 'CONTACT',
                return_due: true,
                skipDeleted: true,
                selectNodes: false,
                selectLeafs: true,
                selectMulty: false,
                selected: '',
            };
            return this._waitClassifSrv.openClassif(OPEN_CLASSIF_ORGANIZ_FULL)
            .then((data) => {
                this.getOrganizationDUE(data, true);
            })
            .catch(er => {
                if (er) {
                    throw er;
                }
            });
        }
    }
    chenge($event) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($event.code === 'Delete') {
            this.form.controls['rec.INN'].setValue('', {emitEvent: false});
            this.form.controls['rec.ADDRES'].setValue('', {emitEvent: false});
            this.form.controls['rec.INDEX'].setValue('', {emitEvent: false});
            this.form.controls['rec.OKPO'].setValue('', {emitEvent: false});
            this.form.controls['rec.OKVED'].setValue('', {emitEvent: false});
            this.form.controls['rec.FULLNAME'].setValue('', {emitEvent: false});
            this.form.controls['rec.NAME'].setValue('', {emitEvent: true});
            this.form.controls['rec.ISN_ORGANIZ'].patchValue('');
        }
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
    submit() {
        /* if (this.form.controls['rec.ISN_ORGANIZ'].value === '') {
            alert('Введите наименование организации');
            return ;
        } */
        if (this.organOld && this.newData.rec['NAME'] !== this.organOld['CLASSIF_NAME']) {
            const flag = confirm(`Значение поля \'Наименование\' не соответсвует полю \'Название\' организации из справочника.
                                    \n Ссылка на спровочник \'Организации\' будет удалена
                                    \n Подтвердждаете изменение?`);
            if (flag) {
                this.newData.rec['ISN_ORGANIZ'] = null;
                this.form.controls['rec.INN'].setValue('', {emitEvent: true});
                this.form.controls['rec.ADDRES'].setValue('', {emitEvent: true});
                this.form.controls['rec.INDEX'].setValue('', {emitEvent: true});
                this.form.controls['rec.OKPO'].setValue('', {emitEvent: true});
                this.form.controls['rec.OKVED'].setValue('', {emitEvent: true});
            } else {
                this.form.controls['rec.NAME'].patchValue(this.organOld['CLASSIF_NAME'], {emitEvent: true});
                this.newData.rec['NAME'] = this.organOld['CLASSIF_NAME'] === '' ? null : this.organOld['CLASSIF_NAME'];
            }
        }
        const dateMerg = {
            NAME: this.newData.rec['NAME'],
            ISN_ORGANIZ: this.newData.rec['ISN_ORGANIZ'],
            ORG_ID: this.newData.rec['ORG_ID'],
        };
        const query = [
            {
                method: 'MERGE',
                requestUri: `DELO_OWNER(-99)`,
                data: dateMerg
            },
        ];
        this.paramApiSrv.setData(query)
            .then(() => {
                this.prepareData.rec = Object.assign({}, this.newData.rec);
                this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                this.formChanged.emit(false);
                this.cancelEdit();
            })
            .catch(er => {
                this.formChanged.emit(true);
                this.isChangeForm = false;
                this.msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка сервера',
                    msg: er.message ? er.message : er
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
        this.cancelEdit();
    }
}
