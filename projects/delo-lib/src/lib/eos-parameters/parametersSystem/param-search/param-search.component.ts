import { Component, Injector, Input, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from './../shared/consts/eos-parameters.const';
import { SEARCH_PARAM } from './../shared/consts/search-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { AbstractControl/* , Validators  */} from '@angular/forms';
import { IConfirmWindow2 } from '../../../eos-common/confirm-window/confirm-window2.component';
import { IElasticParams, IKafkaParams, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';

const UPDATE_INDEXKIND: IConfirmWindow2 = {
    title: 'Предупреждение',
    bodyList: [],
    body: 'Для настройки полнотекстового поиска средствами СУБД или внешней службы необходимо выполнить конфигурирование серверной части системы Дело (см. Руководство администратора)',
    buttons: [
        {title: 'Продолжить ', result: 1, isDefault: true, },
        {title: 'Отменить',  result: 2, },
    ],
};
@Component({
    selector: 'eos-param-search',
    templateUrl: 'param-search.component.html',
    styleUrls: ['./param-search.component.scss']
})
export class ParamSearchComponent extends BaseParamComponent {
    @ViewChild('headerElement', {static: false}) headerElement;
    @Input() btnError;
    public type1 = 'password';
    public paramPassword = '';
    public kafkaUpload: IUploadParam = {
        namespace: 'Eos.Platform.Settings.Search.Indexer',
        typename: 'KafkaCfg',
        instance: 'Default'
    };
    public ElasticUpload: IUploadParam = {
        namespace: 'Eos.Platform.Settings.Search.Indexer',
        typename: 'ElasticCfg',
        instance: 'Default'
    };
    public masDisable: any[] = [];
    private indexKing; // тут храниться значение INDEXKIND чтобы после изменения знать что за значение было до этого
    get typeInput(): string {
        return !this.form.controls['rec.ElasticCfgPassword'].value ? 'text' : this.type1;
    }
    constructor(injector: Injector) {
        super(injector, SEARCH_PARAM);
        this.init()
            .then(() => {
                const allRequest = [];
                allRequest.push(this.getAppSetting<IKafkaParams>(this.kafkaUpload));
                allRequest.push(this.getAppSetting<IElasticParams>(this.ElasticUpload));
                return Promise.all(allRequest)
                .then(([KafkaCfg, ElasticCfg]) => {
                    console.log('form', this.form);
                    if (ElasticCfg) {
                        Object.keys(ElasticCfg).forEach((key) => {
                            this.form.controls['rec.ElasticCfg' + key].setValue(ElasticCfg[key], { emitEvent: false });
                            this.prepareData.rec['ElasticCfg' + key] = ElasticCfg[key];
                        });
                    }
                    if (KafkaCfg) {
                        Object.keys(KafkaCfg).forEach((key) => {
                            if (key === 'ServerURL') {
                                this.form.controls['rec.KafkaCfg' + key].setValue(KafkaCfg[key], { emitEvent: false });
                            }
                            this.prepareData.rec['KafkaCfg' + key] = KafkaCfg[key];
                        });
                        this.form.controls['rec.KafkaCfgServerURL'].setValue(KafkaCfg['ServerURL'], { emitEvent: false });
                        this.prepareData.rec['KafkaCfgServerURL'] = KafkaCfg['ServerURL'];
                    }
                })
                .finally(() => {
                    this.afterInitRC();
                    this.setValidators();
                    this.indexKing = this.form.controls['rec.INDEXKIND'].value;
                });
                
            });
    }
    cancel() {
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init()
                .then(() => {
                    // this.cancelEdit();
                    this.afterInitRC();
                    this.setValidators();
                    this.indexKing = this.form.controls['rec.INDEXKIND'].value;
                })
                .catch(err => {
                    if (err.code !== 401) {
                        console.log(err);
                    }
                });
        }
        this.cancelEdit();
    }
    afterInitRC() {
        this.subscriptions.push(
            this.form.controls['rec.FULLTEXT_EXTENSIONS'].valueChanges
            .pipe(
                debounceTime(300)
            )
            .subscribe(value => {
                if (this.changeByPath('rec.FULLTEXT_EXTENSIONS', value)) {
                    if (value !== value.toUpperCase()) {
                        this.form.controls['rec.FULLTEXT_EXTENSIONS'].patchValue(value.toUpperCase());
                    }
                } else {
                    this.formChanged.emit(false);
                }
            }),
            this.form.controls['rec.INDEXKIND'].valueChanges
            .subscribe(value => {
                if (this.indexKing === 'ES') {
                    this.confirmSrv.confirm2(Object.assign({}, UPDATE_INDEXKIND)).then((button) => {
                        if (button && button['result'] === 1) {
                            /* this.updateEsSettings(value); */
                        } else {
                            this.form.controls['rec.INDEXKIND'].setValue(this.indexKing, { emitEvent: false });
                        }
                    });
                }
            })
        );
        this.cancelEdit();
    }
    // updateEsSettings(value) {
    //     if (value === 'ES') {
    //         this.form.controls['rec.ES_SETTINGS'].setValidators([Validators.required]);
    //         this.inputs['rec.ES_SETTINGS'].required = true;
    //     } else {
    //         this.form.controls['rec.ES_SETTINGS'].setValidators(null);
    //         this.inputs['rec.ES_SETTINGS'].required = false;
    //     }
    //     /* Данное действие нужно для того чтобы отрабатывала проверка и ставился или убирался tooltip об ошибке */
    //     this.form.controls['rec.ES_SETTINGS'].setValue(this.form.controls['rec.ES_SETTINGS'].value);
    //     this.indexKing = this.form.controls['rec.INDEXKIND'].value;
    // }
    edit() {
        Object.keys(this.form.controls).forEach(key => {
            if (this.masDisable.indexOf(key) >= 0) {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
    }
    preSubmit() {
        if (this.updateData['INDEXKIND'] === 'ES' || this.updateData['ES_SETTINGS']) {
            const message = Object.assign({}, UPDATE_INDEXKIND);
            message.body = 'Для работы полнотекстового поиска необходимо выполнить настройку службы Elasticsearch (см. Руководство администратора)';
            this.confirmSrv.confirm2(message).then((button) => {
                if (button && button['result'] === 1) {
                    this.submit();
                } else {
                    this.headerElement.editMode = true;
                }
            });
        } else {
            this.submit();
        }
    }
    submit() {
        if (this.newData) {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            const queruElastic: IElasticParams = {
                ServerURL: this.prepareData.rec['ElasticCfgServerURL'],
                Login: this.prepareData.rec['ElasticCfgLogin'],
                Password: this.prepareData.rec['ElasticCfgPassword']
            };
            const queruKafka: IKafkaParams = {
                ServerURL: this.prepareData.rec['KafkaCfgServerURL'],
                PartitionsCount: this.prepareData.rec['KafkaCfgPartitionsCount'],
                ConsumersCount: this.prepareData.rec['KafkaCfgConsumersCount']
            };
            let flagElastic = false;
            let flagKafka = false;
            Object.keys(this.updateData).forEach((key) => {
                if (key.indexOf('ElasticCfg') !== -1) {
                    queruElastic[key.replace('ElasticCfg', '')] = this.updateData[key];
                    flagElastic = true;
                    delete this.updateData[key];
                }
                if (key.indexOf('KafkaCfg') !== -1) {
                    queruKafka[key.replace('KafkaCfg', '')] = this.updateData[key];
                    flagKafka = true;
                    delete this.updateData[key];
                }
            });
            const request = this.createObjRequest();
            const allNewQuery = [];
            allNewQuery.push(this.paramApiSrv.setData(request));
            if (flagElastic) {
                allNewQuery.push(this.setAppSetting(this.ElasticUpload, queruElastic));
            }
            if (flagKafka) {
                allNewQuery.push(this.setAppSetting(this.kafkaUpload, queruKafka));
            }
            Promise.all(allNewQuery)
            .then(data => {
                    this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this.cancelEdit();
                })
                .catch(data => {
                    this.formChanged.emit(true);
                    this.isChangeForm = true;
                    this.msgSrv.addNewMessage({
                        type: 'danger',
                        title: 'Ошибка сервера',
                        msg: data.message ? data.message : data
                    });
                    this.cancelEdit();
                });
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
        this.paramPassword = this.form.controls['rec.ElasticCfgPassword'].value;
    }
    private setValidators() {
        this.form.controls['rec.FULLTEXT_EXTENSIONS'].setAsyncValidators((control: AbstractControl) => {
            if (control.value) {
                if (control.value.search(/^[^\\\/\|\:\.\*?]{0,2000}$/) !== -1) {
                    for (let index = 0; index < control.value.length; index++) {
                        if (control.value[index].charCodeAt(0) < 31) {
                            control.setErrors({ errorPattern: true });
                            return Promise.resolve({ errorPattern: true });
                        }
                    }
                } else {
                    control.setErrors({ errorPattern: true });
                    return Promise.resolve({ errorPattern: true });
                }
            }
            return Promise.resolve(null);
        });
    }
    onKeyUp($event) {
        this.form.controls['rec.ElasticCfgPassword'].setValue(this.paramPassword);
    }
    setVision() {
        this.type1 = 'text';
    }
    resetVision() {
        this.type1 = 'password';
    }
}
