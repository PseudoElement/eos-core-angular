import { Component, Injector, Input, TemplateRef, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from './../shared/consts/eos-parameters.const';
import { SEARCH_PARAM } from './../shared/consts/search-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { AbstractControl/* , Validators  */} from '@angular/forms';
import { IConfirmWindow2 } from '../../../eos-common/confirm-window/confirm-window2.component';
import { IElasticParams,/*  IKafkaParams,  */IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

const SUBMIT_ERROR_LOGIN: IConfirmWindow2 = {
    title: 'Предупреждение',
    bodyList: [],
    body: 'Неверный логин или пароль пользователя. Нажмите "Продолжить" для создания или обновления пользователя на сервере Elasticsearh. Чтобы сохранить параметры с текущими данными нажмите "Сохранить"',
    buttons: [
        {title: 'Отменить',  result: 0},
        {title: 'Сохранить ', result: 1},
        {title: 'Продолжить',  result: 2, isDefault: true},
    ],
};
const SUBMIT_ERROR_CONNECT: IConfirmWindow2 = {
    title: 'Предупреждение',
    typeIcon: 'danger',
    bodyList: [],
    body: 'Не удалось подключиться к серверу Elasticsearh. Сервер недоступен или имеет некорректные настройки. Сохранить параметры?',
    buttons: [
        {title: 'Отменить ', result: 1},
        {title: 'Сохранить ', result: 2, isDefault: true},
    ],
};
const CONNECT_ERROR: IConfirmWindow2 = {
    title: 'Предупреждение',
    typeIcon: 'danger',
    bodyList: [],
    body: '',
    buttons: [
        {title: 'Скрыть ', result: 1, isDefault: true, },
    ],
};
const ERROR_UPDATE_USER: IConfirmWindow2 = {
    title: 'Предупреждение',
    typeIcon: 'warning',
    bodyList: [],
    body: '',
    buttons: [
        {title: 'Скрыть ', result: 1, isDefault: true, },
    ],
};
@Component({
    selector: 'eos-param-search',
    templateUrl: 'param-search.component.html',
    styleUrls: ['./param-search.component.scss']
})
export class ParamSearchComponent extends BaseParamComponent {
    @ViewChild('modalCheck', { static: true }) modalCheck: TemplateRef<any>;
    modalWordRef: BsModalRef;
    @ViewChild('headerElement', {static: false}) headerElement;
    @Input() btnError;
    public type1 = 'password';
    public typeInputModal = 'password';
    inputLogin: string = '';
    inputPass: string = '';
    public paramPassword = '';
    public kafkaUpload: IUploadParam = {
        namespace: AppsettingsParams['Search.Indexer'],
        typename: AppsettingsTypename.TKafka,
        instance: 'Default'
    };
    public ElasticUpload: IUploadParam = {
        namespace: AppsettingsParams['Search.Indexer'],
        typename: AppsettingsTypename.TElastic,
        instance: 'Default'
    };
    public masDisable: any[] = [];
    // private indexKing; // тут храниться значение INDEXKIND чтобы после изменения знать что за значение было до этого
    get typeInput(): string {
        return !this.form.controls['rec.ElasticCfgPassword'].value ? 'text' : this.type1;
    }
    constructor(injector: Injector,
        private _modalSrv: BsModalService) {
        super(injector, SEARCH_PARAM);
        this.init()
            .then(() => {
                const allRequest = [];
                // allRequest.push(this.getAppSetting<IKafkaParams>(this.kafkaUpload));
                allRequest.push(this.getAppSetting<IElasticParams>(this.ElasticUpload));
                return Promise.all(allRequest)
                .then(([ElasticCfg]) => {
                    if (ElasticCfg) {
                        Object.keys(ElasticCfg).forEach((key) => {
                            this.form.controls['rec.ElasticCfg' + key].setValue(ElasticCfg[key], { emitEvent: false });
                            this.prepareData.rec['ElasticCfg' + key] = ElasticCfg[key];
                        });
                    }
                    /* if (KafkaCfg) {
                        Object.keys(KafkaCfg).forEach((key) => {
                            if (key === 'ServerURL') {
                                this.form.controls['rec.KafkaCfg' + key].setValue(KafkaCfg[key], { emitEvent: false });
                            }
                            this.prepareData.rec['KafkaCfg' + key] = KafkaCfg[key];
                        });
                        this.form.controls['rec.KafkaCfgServerURL'].setValue(KafkaCfg['ServerURL'], { emitEvent: false });
                        this.prepareData.rec['KafkaCfgServerURL'] = KafkaCfg['ServerURL'];
                    } */
                })
                .finally(() => {
                    this.afterInitRC();
                    this.setValidators();
                    // this.indexKing = this.form.controls['rec.INDEXKIND'].value;
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
                    // this.indexKing = this.form.controls['rec.INDEXKIND'].value;
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
                    if (typeof(value) === 'string' && value !== value.toUpperCase()) {
                        this.form.controls['rec.FULLTEXT_EXTENSIONS'].patchValue(value.toUpperCase());
                    }
                } else {
                    this.formChanged.emit(false);
                }
            }),
            // this.form.controls['rec.INDEXKIND'].valueChanges
            // .subscribe(value => {
            //     if (this.indexKing === 'ES') {
            //         this.confirmSrv.confirm2(Object.assign({}, UPDATE_INDEXKIND)).then((button) => {
            //             if (button && button['result'] === 1) {
            //                 /* this.updateEsSettings(value); */
            //             } else {
            //                 this.form.controls['rec.INDEXKIND'].setValue(this.indexKing, { emitEvent: false });
            //             }
            //         });
            //     }
            // })
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
    async preSubmit() {
        if (this.updateData['ElasticCfgServerURL'] || this.updateData['ElasticCfgLogin'] || this.updateData['ElasticCfgPassword']) {
            try {
                const answer = await this.checkConnect();
                if (answer === false) {
                    const message = Object.assign({}, SUBMIT_ERROR_LOGIN);
                    const button = await  this.confirmSrv.confirm2(message);
                    if (button) {
                        switch (button.result) {
                            case 0: /* Отменить */
                                this.headerElement.editMode = true;
                                break;
                            case 1: /* Сохранить */
                                this.submit();
                                break;
                            case 2: /* Продолжить */
                                this.headerElement.editMode = true;
                                this._openModal();
                                break;
                        }
                    }
                } else if (answer === true) {
                    this.submit();
                }
            } catch(er) {
                console.log('error', er);
                this.headerElement.editMode = true;
                let message = '';
                if (typeof(er['error']) === 'string') {
                    message = er['error'].toUpperCase();
                }
                if (message.indexOf('HttpRequestException'.toUpperCase()) >= 0 || message.indexOf('InvalidOperationException'.toUpperCase()) >= 0) {
                    const message1 = Object.assign({}, SUBMIT_ERROR_CONNECT);
                    const button = await this.confirmSrv.confirm2(message1);
                    if (button && button.result === 2) {
                        this.submit();
                    } else {
                        this.headerElement.editMode = true;
                    }
                }
            }
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
            /* const queruKafka: IKafkaParams = {
                ServerURL: this.prepareData.rec['KafkaCfgServerURL'],
                PartitionsCount: this.prepareData.rec['KafkaCfgPartitionsCount'],
                ConsumersCount: this.prepareData.rec['KafkaCfgConsumersCount']
            }; */
            let flagElastic = false;
            // let flagKafka = false;
            Object.keys(this.updateData).forEach((key) => {
                if (key.indexOf('ElasticCfg') !== -1) {
                    queruElastic[key.replace('ElasticCfg', '')] = this.updateData[key];
                    flagElastic = true;
                    delete this.updateData[key];
                }
                /* if (key.indexOf('KafkaCfg') !== -1) {
                    queruKafka[key.replace('KafkaCfg', '')] = this.updateData[key];
                    flagKafka = true;
                    delete this.updateData[key];
                } */
            });
            const request = this.createObjRequest();
            const allNewQuery = [];
            allNewQuery.push(this.paramApiSrv.setData(request));
            if (flagElastic) {
                allNewQuery.push(this.setAppSetting(this.ElasticUpload, queruElastic));
            }
            /* if (flagKafka) {
                allNewQuery.push(this.setAppSetting(this.kafkaUpload, queruKafka));
            } */
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
    getDisabledBtnCheck() {
        const controls = this.form.controls;
        return !controls['rec.ElasticCfgServerURL'].value || !controls['rec.ElasticCfgLogin'].value || !controls['rec.ElasticCfgPassword'].value;
    }
    async checkConnect(): Promise<any> {
        const url = `../CoreHost/elastic/user/check?serverUrl=${this.form.controls['rec.ElasticCfgServerURL'].value}&username=${this.form.controls['rec.ElasticCfgLogin'].value}&password=${this.form.controls['rec.ElasticCfgPassword'].value}`;
        return await this.paramApiSrv.setApiPost().get(url).toPromise();
    }
    async openConnected() {
        try {
            const answ = await this.checkConnect();
            if (answ) {
                const message = Object.assign({}, CONNECT_ERROR);
                message.body = 'Подключение к серверу Elasticsearch выполнено';
                message.typeIcon = 'success';
                this.confirmSrv.confirm2(message);
            } else if (answ === false) {
                throw {code: 500, error: 'Авторизация'};
            }
        } catch (er) {
            console.log('error', er);
            let message = '';
            if (typeof(er['error']) === 'string') {
                message = er['error'].toUpperCase();
            }
            if (message.indexOf('Авторизация'.toUpperCase()) >= 0) {
                const message = Object.assign({}, CONNECT_ERROR);
                message.body = 'Неверные логин или пароль пользователя. Создать или обновить пользователя на сервере Elasticsearh можно при сохранении параметров.';
                this.confirmSrv.confirm2(message);
            } else if (message.indexOf('HttpRequestException'.toUpperCase()) >= 0 || message.indexOf('InvalidOperationException'.toUpperCase()) >= 0) {
                const message = Object.assign({}, CONNECT_ERROR);
                message.body = 'Не удалось подключиться к серверу Elasticsearh. Сервер недоступен или имеет некорректные настройки.';
                this.confirmSrv.confirm2(message);
            }
        }
    }
    cancelModalCheck() {
        this.modalWordRef.hide();
    }
    submitModalCheck() {
        const urlSop = `../CoreHost/elastic/user/add-or-update?serverUrl=${this.form.controls['rec.ElasticCfgServerURL'].value}&masterUsername=${this.inputLogin}&masterPassword=${this.inputPass}&username=${this.form.controls['rec.ElasticCfgLogin'].value}&password=${this.form.controls['rec.ElasticCfgPassword'].value}`;
        this.paramApiSrv.setApiPost()
        .post(urlSop, {}).toPromise()
        .then((response: any) => {
            if (response) {
                const message = Object.assign({}, CONNECT_ERROR);
                message.body = 'Обновление данных пользователя Elasticsearch успешно выполнено';
                message.typeIcon = 'success';
                this.confirmSrv.confirm2(message);
            } else {
                const message = Object.assign({}, ERROR_UPDATE_USER);
                message.body = 'При обновлении данных пользователя Elasticsearch произошла ошибка';
                message.typeIcon = 'warning';
                this.confirmSrv.confirm2(message);
            }
        })
        .catch(() => {
            const message = Object.assign({}, CONNECT_ERROR);
            message.body = 'Не удалось подключиться к серверу: убедитесь в правильности логина и пароля.';
            this.confirmSrv.confirm2(message);
        });
        this.modalWordRef.hide();
    }
     _openModal() {
        this.modalWordRef = this._modalSrv.show(this.modalCheck, { class: 'modalWord', ignoreBackdropClick: true });
    }
    setVisionModal() {
        this.typeInputModal = 'text';
    }
    resetVisionModal() {
        this.typeInputModal = 'password';
    }
}
