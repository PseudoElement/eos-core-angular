import { Component, Injector, Input, OnInit, OnDestroy } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PRJ_RC_PARAM } from '../shared/consts/prj-rc.consts';
import { USER_LISTS } from '../../../eos-rest';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PARM_CANCEL_CHANGE } from '../shared/consts/eos-parameters.const';
import { ExetentionsParametersPrjRcService } from '../../../eos-rest/addons/exetentionsParametersPrjRc.service'
import { IBaseParameters, AdditionalInputs } from '../shared/interfaces/parameters.interfaces';


@Component({
    selector: 'eos-param-prj-rc',
    templateUrl: 'param-prj-rc.component.html'
})
export class ParamPrjRcComponent extends BaseParamComponent implements OnInit, OnDestroy {
    @Input() btnError;
    @Input() optionsRc: USER_LISTS[];
    updateBaseParam: IBaseParameters;
    additionalInputs: AdditionalInputs[];
    private _unsubscribe = new Subject();
    constructor(injector: Injector, public exetentionsParametersPrjRc: ExetentionsParametersPrjRcService) {
        super(injector, exetentionsParametersPrjRc.overrideBaseParam(PRJ_RC_PARAM));
        this.updateBaseParam = exetentionsParametersPrjRc.overrideBaseParam(PRJ_RC_PARAM);
        this.additionalInputs = exetentionsParametersPrjRc.additionalInputs;
    }
    ngOnInit() {
        this.paramApiSrv.getData({
            USER_LISTS: {
                criteries: {
                    ISN_LCLASSIF: -99,
                    CLASSIF_ID: '105'
                }
            }
        }).then((list: USER_LISTS[]) => {
            this.fiillInputForCB(list);
            this.init()
                .then(() => {
                    this.cancelEdit();
                    this.subscribeUnputs();
                })
                .catch(err => {
                    if (err.code !== 401) {
                        console.log(err);
                    }
                });
        }).catch(e => {
            console.log(e);
        });
    }
    subscribeUnputs() {
        this.form.controls['rec.PRJ_STAGE_FILE_PROTECTED'].valueChanges.pipe(
            takeUntil(this._unsubscribe)
        ).subscribe(data => {
            if (data === '000000000') {
                this.form.controls['rec.PRJ_GROUP_FILE_PROTECTED'].patchValue('');
            }
        });
    }
    fiillInputForCB(list: USER_LISTS[]) {
        const field = this.getField('PRJ_GROUP_FILE_PROTECTED');
        if (this._appContext.cbBase) {
            if (list && list.length) {
                if (this.chekOptions(field[0].options)) {
                    list.forEach((l: USER_LISTS) => {
                        field[0].options.push({ value: l.ISN_LIST, title: l.NAME });
                    });
                }
            } else {
                field[0].options.splice(1);
            }
        }
    }
    getField(name: string): any {
        return this.updateBaseParam.fields.filter(field => {
            return field.key === name;
        });
    }
    chekOptions(key: Array<any>): boolean {
        if (key.length > 1) {
            return false;
        }
        return true;
    }
    edit() {
        this.form.enable({ emitEvent: false });
    }
    cancel() {
        if (this.newData) {
            this.init().then(() => {
                setTimeout(() => {
                    this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
                    this.isChangeForm = false;
                    this.formChanged.emit(false);
                    this.ngOnDestroy();
                    this.cancelEdit();
                }, 0);
            });
        } else {
            this.cancelEdit();
        }
    }

    cancelEdit() {
        this.form.disable({ emitEvent: false });
    }

    /**
     * Rewrite parent's method "createObjRequest" for deletion of 2 requests.
     * Requests for "PRJ_GROUP_FILE_PROTECTED" and "PRJ_RC_SECURLEVEL_CONSIDER" inputs
     * invoke "500 internal server error".
     */
    createObjRequest() {
        const requests = super.createObjRequest();
        /* убираю удаление запросов, ошибку которая была связана с этим багом больше не вызывается */
        /* const filteredRequests = requests.filter((req) => {
            return (!this._appContext.cbBase && req.requestUri.indexOf('PRJ_GROUP_FILE_PROTECTED') === -1) &&
            req.requestUri.indexOf('PRJ_RC_SECURLEVEL_CONSIDER') === -1;
        }); */

        return requests;
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
