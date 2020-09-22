import { Component, Injector, ViewChild, OnChanges, HostListener } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';
import { CABINET_FOLDERS } from 'eos-dictionaries/consts/dictionaries/cabinet.consts';
import { DEPARTMENT, PipRX, CABINET } from 'eos-rest';
import { IOrderBy } from '../interfaces';
import { AbstractControl, FormControl } from '@angular/forms';
import { CONFIRM_CABINET_NON_EMPTY } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';

interface ICabinetOwner {
    index: number;
    marked: boolean;
    data: DEPARTMENT;
}

@Component({
    selector: 'eos-cabinet-card-edit',
    templateUrl: 'cabinet-card-edit.component.html',
})
export class CabinetCardEditComponent extends BaseCardEditComponent implements OnChanges {
    readonly tabs = ['Основные данные', 'Доступ пользователей к кабинету'];
    status: any = {
        showOwners: true,
        showAccess: true,
        showFolders: true,
    };

    allMarkedAccess = false;
    allMarkedOwners = false;

    accessHeaders = [];
    cabinetFolders = [];
    cabinetOwners: ICabinetOwner[] = [];
    cabinetUsers = [];

    foldersMap: Map<number, any>;
    showScroll = false;

    orderBy: IOrderBy = {
        ascend: true,
        fieldKey: 'SURNAME'
    };

    @ViewChild('tableEl') tableEl;
    @ViewChild('intupString') intupString;

    // private _apiSrv: PipRX;
    // private folderList: any[];

    /* tslint:disable:no-bitwise */
    get anyMarkedAccess(): boolean {
        return this.updateAccessMarks();
    }

    get anyMarkedOwners(): boolean {
        return this.updateOwnersMarks();
    }

    get folderListControls(): AbstractControl[] {
        const controls = [];
        Object.keys(this.form.controls).forEach((key) => {
            if (key.indexOf('FOLDER_List') > -1) {
                controls.push(this.form.controls[key]);
            }
        });
        return controls;
    }

    get anyUnmarkedAccess(): boolean {
        return this.folderListControls.findIndex((ctrl) => !ctrl.value) > -1;
    }

    get anyUnmarkedOwners(): boolean {
        return !!~this.cabinetOwners.findIndex((_person) => !_person.marked && _person.data.ISN_CABINET === this.data.rec['ISN_CABINET']);
    }
    /* tslint:enable:no-bitwise */

    get possibleOwners(): any[] {
        const res = this.cabinetOwners
            .filter((owner) => !owner.data['ISN_CABINET'] && !owner.data['ISN_ORGANIZ']
                && owner.data['ISN_HIGH_NODE'] && !owner.data['DELETED']);
        return res;
    }

    private scrollStep = 5;
    private scrollInterval = 50;
    private _interval: any;

    constructor(injector: Injector,
        private _confirmSrv: ConfirmWindowService,
        private _classifSrv: WaitClassifService,
    ) {
        super(injector);
        this.foldersMap = new Map<number, any>();
        CABINET_FOLDERS.forEach((folder) => {
            this.foldersMap.set(folder.key, folder);
        });
        // this._apiSrv = injector.get(PipRX);
        // this.folderList = [];
    }

    ngOnChanges() {
        if (this.data && this.data.rec) {
            this.init(this.data);
            this.currTab = 0;
        }
        this.tabsToArray(this.tabs);
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe(() => {
                this.updateValidTabs();
                if (this.form.controls['rec.CABINET_NAME'].value && this.form.controls['rec.CABINET_NAME'].value.indexOf('"') !== -1) {
                    const val = this.form.controls['rec.CABINET_NAME'].value.replace('"', '');
                    this.form.controls['rec.CABINET_NAME'].patchValue(val);
                    this.inputs['rec.CABINET_NAME'].value = val;
                }
            });
            setTimeout(() => {
                this.form.controls['rec.CABINET_NAME'].setAsyncValidators((control: AbstractControl) => {
                    if (control && control.value && control.value.length) {
                        return this.appctx['pip']['read']({
                            CABINET: {
                                criteries: {
                                    DUE: this.data.rec.DUE,
                                    CABINET_NAME: '="' + control.value + '"'
                                }
                            }
                        }).then((date: CABINET[]) => {
                            if (date && date.length) {
                                const filteredDate = date.filter((_d) => {
                                    return _d.ISN_CABINET !== this.data.rec.ISN_CABINET;
                                });
                                if (filteredDate.length) {
                                    setTimeout(() => {
                                        if (this.intupString) {
                                            this.intupString.input.dib.toggleTooltip();
                                        }
                                    });
                                    return { isUnique: true };
                                }
                                return null;
                            }
                        });
                    } else {
                        return Promise.resolve(null);
                    }
                });
                this.form.controls['rec.CABINET_NAME'].updateValueAndValidity();
            }, 500);
        }
    }

    getCardTitle(): any {
        if (this.data && this.data.department && this.data.department.CLASSIF_NAME) {
            return this.data.department.CLASSIF_NAME;
        }
        return null;
    }

    add(owner: ICabinetOwner) {
        if (!owner.data['DELETED']) {
            this.setValue(this.getOwnerPath(owner.index), this.data.rec.ISN_CABINET);
            owner.data.ISN_CABINET = this.data.rec.ISN_CABINET;
        }
    }

    endScroll() {
        window.clearInterval(this._interval);
    }

    setTab(idx: number) {
        super.setTab(idx);
        setTimeout(() => {
            this.updateScroller();
        }, 0);
    }

    folderTitle(folderType: number): string {
        let title = '';
        if (folderType) {
            const folder = this.foldersMap.get(folderType);
            if (folder) {
                title = folder.title;
            }
        }
        return title;
    }

    order(fieldKey: string) {
        if (this.orderBy.fieldKey === fieldKey) {
            this.orderBy.ascend = !this.orderBy.ascend;
        } else {
            this.orderBy.ascend = true;
            this.orderBy.fieldKey = fieldKey;
        }
        this.reorderCabinetOwners();
    }


    _checkDeletion(due): Promise<any> {
        return this._classifSrv.canChangeClassifRequest('DEPARTMENT', 'DELETE_FROM_CABINET', { id: String(due) });
    }

    remove() {
        this.cabinetOwners.filter((owner) => owner.marked)
            .forEach((owner) => {
                let canceled = false;
                this._checkDeletion(owner.data['DUE']).then(result => {
                    if (result === 'DOC_FOLDER_NOT_EMPTY_BY_RESOLUTION' ||
                        result === 'DOC_FOLDER_NOT_EMPTY_BY_REPLY' ||
                        result === 'NP_FOLDER_NOT_EMPTY_BY_NP_ACL') {
                        const testc: IConfirmWindow2 = Object.assign({}, CONFIRM_CABINET_NON_EMPTY);
                        testc.body = testc.body.replace('{{XXX}}', (owner.data.CLASSIF_NAME));

                        return this._confirmSrv.confirm2(testc).then(button => {

                            if (!button || button.result === 3) {
                                canceled = true;

                            } else if (button.result === 1) {
                                if (!this.data['updateTrules']) {
                                    this.data['updateTrules'] = [];
                                }
                                PipRX.invokeSop(this.data['updateTrules'], 'DepartmentCabinet_TRule', { 'due': owner.data['DUE'], 'ClearCabinet': 1, 'MoveCabinet': 0 });
                            }
                        });
                    }
                }).then(() => {
                    if (!canceled) {
                        this.setValue(this.getOwnerPath(owner.index), null);
                        owner.data['ISN_CABINET'] = null;
                        owner.marked = false;
                    }
                });
            });
        this.updateOwnersMarks();
        // this.formChanged.emit(this.data);
    }

    startScrollToLeft() {
        if (this._interval) {
            window.clearInterval(this._interval);
        }
        this._interval = setInterval(() => {
            if (this.tableEl.nativeElement.scrollLeft > this.scrollStep) {
                this.tableEl.nativeElement.scrollLeft -= this.scrollStep;
            } else {
                this.tableEl.nativeElement.scrollLeft = 0;
            }
        }, this.scrollInterval);
    }

    startScrollToRight() {
        if (this._interval) {
            window.clearInterval(this._interval);
        }
        this._interval = setInterval(() => {
            if (this.tableEl.nativeElement.scrollLeft + this.scrollStep < this.tableEl.nativeElement.scrollWidth) {
                this.tableEl.nativeElement.scrollLeft += this.scrollStep;
            } else {
                this.tableEl.nativeElement.scrollLeft = this.tableEl.nativeElement.scrollWidth;
            }
        }, this.scrollInterval);
    }

    toggleAllAccessMarks() {
        Object.keys(this.form.controls).forEach((key) => {
            if (key.indexOf('FOLDER_List') > -1) {
                const ctrl = this.form.controls[key];
                ctrl.setValue(this.allMarkedAccess);
            }
        });
    }

    toggleAllOwnersMarks() {
        this.cabinetOwners.forEach((_person) => {
            _person.marked = this.allMarkedOwners && _person.data['ISN_CABINET'] === this.data.rec['ISN_CABINET'];
        });
    }

    emitHeadCheckbox(mark: boolean): void {
        if (mark && !this.allMarkedOwners) {
            this.allMarkedOwners = !this.allMarkedOwners;
        }
    }

    private getOwnerPath(index: number) {
        return 'owners[' + index + '].ISN_CABINET';
    }

    private init(data: any) {
        // console.log('data', data);
        this.cabinetOwners = [];
        this.dictSrv.getCabinetOwners(data.department.DEPARTMENT_DUE).then((owners) => {
            data.owners = owners;
            Object.keys(this.form.controls).forEach((key) => {
                if (key.indexOf('owners') > -1) {
                    this.form.removeControl(key);
                }
            });
            this.cabinetOwners = owners.map((owner, idx) => {
                const path = 'owners[' + idx + '].ISN_CABINET';
                this.form.addControl(path, new FormControl(owner['ISN_CABINET']));

                return <ICabinetOwner>{
                    index: idx,
                    marked: false,
                    data: owner,
                };
            });

            this.reorderCabinetOwners();
        });

        this.cabinetFolders = CABINET_FOLDERS;

        this.accessHeaders = [{
            title: 'Ограничение доступа к РК',
            key: 'rk'
        }, {
            title: 'Ограничение доступа к РКПД',
            key: 'rkpd'
        }];

        this.cabinetUsers = [];
        data.users.forEach((user) => {
            const userAccess = data.cabinetAccess.find((access) => access.ISN_LCLASSIF === user.ISN_LCLASSIF);
            if (userAccess) {
                const cUser = {
                    fio: user.SURNAME_PATRON,
                    rk: userAccess.HIDE_INACCESSIBLE,
                    rkpd: userAccess.HIDE_INACCESSIBLE_PRJ
                };
                this.cabinetFolders.forEach((folder) => {
                    cUser[folder.key] = userAccess.FOLDERS_AVAILABLE.indexOf(folder.charKey + '') > -1;
                });
                this.cabinetUsers.push(cUser);
            }
        });

        this.updateAccessMarks();
        this.updateOwnersMarks();

        if (this._interval) {
            window.clearInterval(this._interval);
        }
        this._interval = setInterval(() => {
            this.updateScroller();
        }, this.scrollInterval);

    }

    private reorderCabinetOwners() {
        const orderBy = this.orderBy;
        this.cabinetOwners = this.cabinetOwners.sort((a, b) => {
            const _a = a.data[orderBy.fieldKey];
            const _b = b.data[orderBy.fieldKey];
            const result = String(_a).localeCompare(String(_b));
            return result * (orderBy.ascend ? 1 : -1);
            // if (typeof _a === 'string' || typeof _b === 'string') {
            //     _a = (_a + '').toLocaleLowerCase();
            //     _b = (_b + '').toLocaleLowerCase();
            // }
            // if (_a > _b) {
            //     return orderBy.ascend ? 1 : -1;
            // }
            // if (_a < _b) {
            //     return orderBy.ascend ? -1 : 1;
            // }
            // if (_a === _b) {
            //     return 0;
            // }
        });
    }

    private updateAccessMarks(): boolean {
        return this.allMarkedAccess = this.folderListControls.findIndex((ctrl) => ctrl.value) > -1;
    }

    private updateOwnersMarks(): boolean {
        return this.allMarkedOwners = this.cabinetOwners.findIndex((_person) =>
            _person.marked && _person.data.ISN_CABINET === this.data.rec['ISN_CABINET']) > -1;
    }

    @HostListener('window:resize')
    private updateScroller() {
        if (this.tableEl && this.tableEl.nativeElement.scrollWidth) {
            this.showScroll = this.tableEl.nativeElement.scrollWidth > this.tableEl.nativeElement.clientWidth;
        } else {
            this.showScroll = false;
        }
    }
}
