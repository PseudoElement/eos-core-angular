
import {Component, OnDestroy, OnInit, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { IBaseInput } from 'eos-common/interfaces';
import { UntypedFormGroup } from '@angular/forms';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { InputControlService } from 'eos-common/services/input-control.service';
import { PipRX, DEPARTMENT } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { Router } from '@angular/router';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { CONFIRM_OPERATION_NOMENKL_CLOSED, CONFIRM_OPERATION_HARDDELETE } from 'app/consts/confirms.const';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { APS_DICT_GRANT, EosAccessPermissionsService } from 'eos-dictionaries/services/eos-access-permissions.service';
interface SORTCONFIG {
    CLASSIF_NAME: SORTITEM;
    NOM_NUMBER: SORTITEM;
    YEAR_NUMBER: SORTITEM;
    END_YEAR: SORTITEM;
    DEPARTMENT: SORTITEM;
}
interface SORTITEM {
    selected: boolean;
    up: boolean;
}

@Component({
    selector: 'eos-check-index-nomenclatur',
    styleUrls: ['./check-index-nomenclatur.component.scss'],
    templateUrl: 'check-index-nomenclatur.component.html',
})

export class CheckIndexNomenclaturComponent implements OnDestroy, OnInit {
    @Output() onHide: EventEmitter<any> = new EventEmitter<any>();
    @Output() onOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('settingsWindow', { static: true }) settingsWindow: ElementRef;
    @ViewChild('redactWindow', { static: true }) redactWindow: ElementRef;
    searchForm: UntypedFormGroup;
    inputs: InputBase<any>[];
    forWhom: number = 0;
    where: number = 0;
    public modalRef: BsModalRef;
    public modalRefRedact: BsModalRef;
    public notUniqueElem = [];
    public selectedItem: any = {};
    public selectedItemLinc = {};
    public sortConfig: SORTCONFIG = {
        CLASSIF_NAME: {
            selected: true,
            up: true,
        },
        NOM_NUMBER: {
            selected: false,
            up: true,
        },
        YEAR_NUMBER: {
            selected: false,
            up: true,
        },
        END_YEAR: {
            selected: false,
            up: true,
        },
        DEPARTMENT: {
            selected: false,
            up: true,
        },
    };
    public currentSort  = 'CLASSIF_NAME';
    filterInputs: IBaseInput[] = [
       {
            controlType: 'numberIncrement',
            key: 'stateYear',
            value: new Date().getFullYear(),
            label: 'Состояние на',
            pattern: /(^\d{4}$)/,
            hideLabel: true,
            readonly: false,
            required: true,
            minValue: 1900,
            maxValue: 2100,
        },
        {
            controlType: '',
            key: 'NOM_NUMBER',
            value: '',
            label: 'Состояние на',
            hideLabel: true,
            length: 24,
            readonly: false,
            required: true,
            minValue: 1900,
        }
    ];
    constructor(
        private inputCtrlSrv: InputControlService,
        private pip: PipRX,
        private _errorSrv: ErrorHelperServices,
        private _router: Router,
        private _confirmSrv: ConfirmWindowService,
        private _modalSrv: BsModalService,
        private _msgSrv: EosMessageService,
        private _eaps: EosAccessPermissionsService,
    ) {
        this.inputs = this.inputCtrlSrv.generateInputs(this.filterInputs);
        this.searchForm = this.inputCtrlSrv.toFormGroup(this.inputs, false);
    }
    getSelectElem() {
        return this.selectedItem['ISN_LCLASSIF'] ? false : true;
    }
    cancelCreate() {
        this.onHide.emit(true);
    }
    ngOnInit() {
    }
    ngOnDestroy() {
    }
    close() {
        this.onHide.emit(true);
        this.modalRef.hide();
    }
    clickForItem(item) {
        this.selectedItem = JSON.parse(JSON.stringify(item));
        this.selectedItemLinc = item;
    }
    edit() {
        if (this.selectedItem['ISN_LCLASSIF']) {
            const config = { ignoreBackdropClick: true };
            this.searchForm.controls['NOM_NUMBER'].setValue(this.selectedItem['NOM_NUMBER']);
            this.modalRefRedact = this._modalSrv.show(this.redactWindow, config);
        }
    }
    closeRedact() {
        this.modalRefRedact.hide();
    }
    checkIndex() {
        const stateYear = +this.searchForm.controls['stateYear'].value;
        let query;
        if (this.forWhom === 0 || this.where === 1) {
            query = {
                NOMENKL_CL: {
                    criteries: {}
                }
            };
            if (this.forWhom === 0) {
                query.NOMENKL_CL.criteries['DUE'] = this._router.url.split('/').pop();
            }
            if (this.where === 1) {
                query.NOMENKL_CL.criteries['CLOSED'] = 0;
            }
        } else {
            query = {
                NOMENKL_CL: ALL_ROWS
            };
        }
        this.pip.read(query)
        .then((answer: any[]) => {
            const checkUnique = answer.filter(elem => {
                return +elem['YEAR_NUMBER'] <= stateYear && (!elem['END_YEAR'] || +elem['END_YEAR'] >= stateYear);
            });
            const uniqueNumIndex = [];
            const notUniqueNumIndex = [];
            checkUnique.forEach(elem => {
                const indexOf = uniqueNumIndex.indexOf(elem['NOM_NUMBER']);
                if (indexOf === -1) {
                    uniqueNumIndex.push(elem['NOM_NUMBER']);
                } else {
                    notUniqueNumIndex.push(elem['NOM_NUMBER']);
                }
            });
            if (notUniqueNumIndex.length === 0) {
                this._confirmSrv.confirm2({
                    title: 'Результат проверки',
                    bodyList: [],
                    body: 'Индексы дел уникальны',
                    bodyAfterList: '',
                    buttons: [
                        {title: 'Ок', result: 1, isDefault: true, },
                    ],
                });
                this.onHide.emit(true);
            }
            if (notUniqueNumIndex.length > 0) {
                this.onHide.emit(true);
                this.notUniqueElem = checkUnique.filter(elem => {
                    if (notUniqueNumIndex.indexOf(elem['NOM_NUMBER']) === -1) {
                        return false;
                    } else {
                        return true;
                    }
                });
                this.loadDepartment();
                this.sortindex(this.currentSort);
                const config = { ignoreBackdropClick: true, class: 'custom-modal' };
                this.modalRef = this._modalSrv.show(this.settingsWindow, config);
            }
        })
        .catch(er => {
            this._errorSrv.errorHandler(er);
        });
    }
    loadDepartment() {
        const ids = [];
        this.notUniqueElem.forEach(element => {
            ids.push(element['DUE']);
        });
        this.pip.read<DEPARTMENT>({DEPARTMENT: ids}).then(data => {
            if (data && data.length) {
                this.notUniqueElem.map(ind => {
                    const findDepartMent = data.filter(d => {
                        return d.DUE === ind.DUE;
                    });
                    ind['DEPARTMENT'] = findDepartMent[0].CLASSIF_NAME;
                    return ind;
                });
            }
        }).catch(e => {
            this._errorSrv.errorHandler(e);
        });
    }
    sortindex(currentSort): void {
        this.notUniqueElem.sort((a, b) => {
            const res = String(a[currentSort]).localeCompare(String(b[currentSort]));
            return (this.sortConfig[currentSort].up ? 1 : -1) * res;
        });
    }
    orderIndex(key: string) {
        if (this.currentSort !== key) {
            this.sortConfig[this.currentSort]['selected'] = false;
            this.currentSort = key;
            this.sortConfig[this.currentSort]['selected'] = true;
            this.sortConfig[this.currentSort]['up'] = !this.sortConfig[this.currentSort]['up'];
        } else {
            this.sortConfig[this.currentSort]['selected'] = true;
            this.sortConfig[this.currentSort]['up'] = !this.sortConfig[this.currentSort]['up'];
        }
        this.sortindex(this.currentSort);
    }
    updateNomenc() {
        if (this.selectedItem['ISN_LCLASSIF']) {
            if (String(this.searchForm.controls['NOM_NUMBER'].value).trim().length > 0) {
                const chl = {
                    method: 'MERGE',
                    requestUri: 'NOMENKL_CL(' + this.selectedItem['ISN_LCLASSIF'] + ')',
                    data: {
                        NOM_NUMBER: this.searchForm.controls['NOM_NUMBER'].value.trim()
                    }
                };
                this.pip.batch([chl], '')
                .then(ans => {
                    this.selectedItemLinc['NOM_NUMBER'] = this.searchForm.controls['NOM_NUMBER'].value.trim();
                    this.selectedItem['NOM_NUMBER'] = this.searchForm.controls['NOM_NUMBER'].value.trim();
                    this.modalRefRedact.hide();
                })
                .catch(er => {
                    this._errorSrv.errorHandler(er);
                });
            } else {
                this._confirmSrv.confirm2({
                    title: 'Результат проверки',
                    bodyList: [],
                    body: 'Не задан индекс номенклатуры',
                    bodyAfterList: '',
                    buttons: [
                        {title: 'Ок', result: 1, isDefault: true, },
                    ],
                });
            }
        }
    }
    public canChangeClassifRequest(id): Promise<any> {
        const qargs = { type: 'NOMENKL_CL', oper: 'DELETE', id: String(id) };
        const query = { args: qargs };
        const req = { CanChangeClassif: query };
        return this.pip.read(req);
    }
    removeHard() {
        const chl = {
            method: 'DELETE',
            requestUri: 'NOMENKL_CL(' + this.selectedItem['ISN_LCLASSIF'] + ')'
        };
        this.pip.batch([chl], '')
        .then(ans => {
            this.notUniqueElem = this.notUniqueElem.filter(elem => elem['ISN_LCLASSIF'] !== this.selectedItem['ISN_LCLASSIF']);
            this.selectedItem = {};
        })
        .catch(er => {
            this._errorSrv.errorHandler(er);
        });
    }
    closedNom(): Promise<any> {
        const chl = {
            method: 'MERGE',
            requestUri: 'NOMENKL_CL(' + this.selectedItem['ISN_LCLASSIF'] + ')',
            data: {
                CLOSED: '1'
            }
        };
        return this.pip.batch([chl], '')
        .catch(er => {
            this._errorSrv.errorHandler(er);
        });
    }
    delet() {
        this.canChangeClassifRequest(this.selectedItem['ISN_LCLASSIF'])
        .then(ans => {
            if (ans === 'DELO_EXISTS') {
                if (this.selectedItem['CLOSED'] === 1) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: 'элемент "' + this.selectedItem['CLASSIF_NAME'] + '" нельзя удалить! Дела непустые и уже закрыты!'
                    });
                } else {
                    const confirmClosed: IConfirmWindow2 = Object.assign({}, CONFIRM_OPERATION_NOMENKL_CLOSED);
                    confirmClosed.bodyList = [];
                    confirmClosed.bodyList.push(this.selectedItem['CLASSIF_NAME']);
                    this._confirmSrv.confirm2(confirmClosed)
                    .then(elem => {
                        if (elem && elem.result === 2) {
                            this.closedNom()
                            .then(correct => {
                                this.selectedItemLinc['CLOSED'] = 1;
                            });
                        }
                    });
                }
            } else {
                const confirmRemove: IConfirmWindow2 = Object.assign({}, CONFIRM_OPERATION_HARDDELETE);
                confirmRemove.bodyList = [];
                confirmRemove.bodyList.push(this.selectedItem['CLASSIF_NAME']);
                this._confirmSrv.confirm2(confirmRemove)
                    .then(elem => {
                        if (elem && elem.result === 2) {
                            this.removeHard();
                        }
                    });
            }
        })
        .catch(er => {
            this._errorSrv.errorHandler(er);
        });
    }
    checkButtonsAccess(): boolean {
        if (this.selectedItem) {
            const grant = this.selectedItem.DUE ? this._eaps.isAccessGrantedForDictionary('nomenkl', this.selectedItem.DUE) : APS_DICT_GRANT.denied;
            return APS_DICT_GRANT.readwrite > grant;
        }
        return true;
    }
}
