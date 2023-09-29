import { Component, Injector, ViewChild, OnChanges, HostListener } from '@angular/core';

import { BaseCardEditDirective } from './base-card-edit.component';
import { CABINET_FOLDERS } from '../../eos-dictionaries/consts/dictionaries/cabinet.consts';
import { DEPARTMENT, PipRX, CABINET } from '../../eos-rest';
import { IOrderBy } from '../interfaces';
import { AbstractControl, FormControl } from '@angular/forms';
import { CONFIRM_ADD_DL_UPDATE_CAB, CONFIRM_CABINET_NON_EMPTY } from '../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { WaitClassifService } from '../../app/services/waitClassif.service';
import { IConfirmWindow2 } from '../../eos-common/confirm-window/confirm-window2.component';
import { BsDropdownDirective } from 'ngx-bootstrap';
import { IOpenClassifParams } from '../../eos-common/interfaces';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

interface ICabinetOwner {
    index: number;
    marked: boolean;
    data: DEPARTMENT;
    isOwnerView: boolean;
    orderNum: number | null;
}

@Component({
    selector: 'eos-cabinet-card-edit',
    templateUrl: 'cabinet-card-edit.component.html',
})
export class CabinetCardEditComponent extends BaseCardEditDirective implements OnChanges {
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
        fieldKey: 'SURNAME',
    };
    isUserSorted = false;

    @ViewChild('tableEl', { static: false }) tableEl;
    @ViewChild('intupString', { static: false }) intupString;
    public cabFolder;
    private _apiSrv: PipRX;
    private _msgSrv: EosMessageService;
    // private folderList: any[];

    /* tslint:disable:no-bitwise */
    get anyMarkedAccess(): boolean {
        return this.updateAccessMarks();
    }

    get anyMarkedOwners(): boolean {
        return this.updateOwnersMarks();
    }
    get localUserSort(): boolean {
        return Boolean(JSON.parse(localStorage.getItem('userSortCabinet')));
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
        return !!~this.cabinetOwners.findIndex(
            (_person) => !_person.marked && _person.data.ISN_CABINET === this.data.rec['ISN_CABINET']
        );
    }
    /* tslint:enable:no-bitwise */

    get disabledAnyMarkedCheckbox(): boolean {
        return !!this.Owners.length;
    }
    get Owners(): ICabinetOwner[] {
        return this.cabinetOwners.filter(cabinet => {
            return cabinet.data.ISN_CABINET === this.data.rec['ISN_CABINET'];
        });
    }
    get checkedOwners(): ICabinetOwner[] {
        return this.Owners.filter(owner => owner.marked);
    }

    get getflagChecked() {
        const count = this.Owners.length - this.checkedOwners.length;
        switch (count) {
            case 0:
                return ' ';
            case this.Owners.length:
                return '';
            default:
                return 'group-checkbox';
        }
    }
    get possibleOwners(): any[] {
        const res = this.cabinetOwners.filter(
            (owner) =>
                !owner.data['ISN_CABINET'] &&
                !owner.data['ISN_ORGANIZ'] &&
                owner.data['ISN_HIGH_NODE'] &&
                !owner.data['DELETED']
        );
        return res;
    }

    private scrollStep = 5;
    private scrollInterval = 50;
    private _interval: any;

    constructor(
        injector: Injector,
        private _confirmSrv: ConfirmWindowService,
        private _classifSrv: WaitClassifService
    ) {
        super(injector);
        this.foldersMap = new Map<number, any>();
        CABINET_FOLDERS.forEach((folder) => {
            this.foldersMap.set(folder.key, folder);
        });
        this.cabFolder = [...CABINET_FOLDERS];
        this._apiSrv = injector.get(PipRX);
        this._msgSrv = injector.get(EosMessageService);
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
            this.formChanges$ = this.form.valueChanges.subscribe((change) => {
                this.updateValidTabs();
                if (
                    this.form.controls['rec.CABINET_NAME'].value &&
                    this.form.controls['rec.CABINET_NAME'].value.indexOf('"') !== -1
                ) {
                    const val = this.form.controls['rec.CABINET_NAME'].value.replace('"', '');
                    this.form.controls['rec.CABINET_NAME'].patchValue(val);
                    this.inputs['rec.CABINET_NAME'].value = val;
                }
                if (change['rec.FOLDER_List[0].USER_COUNT'] !== change['rec.FOLDER_List[1].USER_COUNT']) {
                    this.form.controls['rec.FOLDER_List[0].USER_COUNT'].patchValue(change['rec.FOLDER_List[1].USER_COUNT']);
                }
            });
            setTimeout(() => {
                this.form.controls['rec.CABINET_NAME'].setAsyncValidators((control: AbstractControl) => {
                    if (control && control.value && control.value.length) {
                        return this.appctx['pip']
                        ['read']<CABINET>({
                            CABINET: {
                                criteries: {
                                    DUE: this.data.rec.DUE,
                                    CABINET_NAME: '="' + control.value + '"',
                                },
                            },
                        })
                            .then((date: CABINET[]) => {
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

    get isTop(): boolean {
        const is = this.cabinetOwners.filter((o) => o.isOwnerView);
        return this.anyMarkedOwners && is.length && !is[0].marked;
    }
    get isBot(): boolean {
        const is = this.cabinetOwners.filter((o) => o.isOwnerView);
        return this.anyMarkedOwners && is.length && !is[is.length - 1].marked;
    }
    getCardTitle(): any {
        if (this.data && this.data.department && this.data.department.CLASSIF_NAME) {
            return this.data.department.CLASSIF_NAME;
        }
        return null;
    }

    add(owner: ICabinetOwner) {
        if (!owner.data['DELETED']) {
            const ownerOrder = this.getMaxOrderNum();
            this.setValue(this.getOwnerPath(owner.index), this.data.rec.ISN_CABINET);
            this.setValue(this.getOrderNumPath(owner.index), ownerOrder);
            owner.data.ISN_CABINET = this.data.rec.ISN_CABINET;
            owner.orderNum = ownerOrder;
            if (this.isUserSorted) {
                this.reorderNum();
            }
        }
    }
    addUserDepartment() {
        const selected: string[] = [];
        const cabinets: ICabinetOwner[] = this.getCabinetsOwners();
        // const ownersT: any = [];
        cabinets.forEach(dep => {
            selected.push(dep.data['DUE']);
        });
        /* this.data.owners.forEach((own) => {
            ownersT.push(own['DUE']);
        }); */
        const OPEN_CLASSIF_ORGANIZ_DEP: IOpenClassifParams = {
            classif: 'DEPARTMENT',
            return_due: true,
            // selected: selected.join('|'),
            curdue: this.data.rec['DUE'],
            skipDeleted: true,
            selectMulty: false,
            selectLeafs: true,
            selectNodes: false,
        };
        return this._classifSrv.openClassif(OPEN_CLASSIF_ORGANIZ_DEP)
            .then((due: string) => {
                const queryDue: string[] = [];
                due.split('|').forEach((el) => {
                    if (el) {
                        const notNew = this.possibleOwners.findIndex((own: ICabinetOwner) => own.data['DUE'] === el);
                        if (notNew > -1) {
                            this.add(this.possibleOwners[notNew]);
                        } else if (selected.indexOf(el) === -1) {
                            queryDue.push(el);
                        } else if (selected.indexOf(el) > -1) {
                            this._msgSrv.addNewMessage({ // 154357 если выбранный пользователь уже является владельцем кабинета
                                type: 'warning',
                                title: 'Предупреждение',
                                msg: `Должностное лицо ${cabinets[selected.indexOf(el)].data['SURNAME']} уже является владельцем этого кабинета`
                            });
                        }
                    }
                });
                if (queryDue.length === 0) {
                    return;
                }
                const updateCab: any[] = [];
                const updateCabIsn: string[] = [];
                const ans: DEPARTMENT[] = this.data.allOwner.filter((data) => {
                    if (queryDue.indexOf(data['DUE']) !== -1) {
                        if (data['ISN_CABINET']) {
                            updateCab.push(data);
                            updateCabIsn.push('' + data['ISN_CABINET']);
                        }
                        return true;
                    } else {
                        return false;
                    }
                });
                const cabUserCount = new Map();
                if (updateCabIsn.length > 0) {
                    this.data.allOwner.forEach((own) => {
                        if (cabUserCount.has(own['ISN_CABINET'])) {
                            cabUserCount.set(own['ISN_CABINET'], cabUserCount.get(own['ISN_CABINET']) + 1);
                        } else {
                            cabUserCount.set(own['ISN_CABINET'], 1);
                        }
                    });
                }
                if (updateCab.length > 0) {
                    this._apiSrv.read<CABINET>({
                        CABINET: {
                            criteries: {
                                ISN_CABINET: updateCabIsn.join('|'),
                            }
                        }
                    })
                        .then((cab: CABINET[]) => {
                            const testc: IConfirmWindow2 = Object.assign({}, CONFIRM_ADD_DL_UPDATE_CAB);
                            const cabMap = new Map();

                            cab.forEach((c) => {
                                cabMap.set(c['ISN_CABINET'], c['CABINET_NAME']);
                            });
                            const mesageAr: string[] = [];
                            const mesageAr2: string[] = [];
                            updateCab.forEach((c) => {
                                if (cabUserCount.get(c['ISN_CABINET']) === 1) {
                                    mesageAr2.push(`В кабинете ${cabMap.get(c['ISN_CABINET']) || ''} ${c['SURNAME']} является единственным владельцем. Продолжить операцию?`);
                                }
                                mesageAr.push(
                                    `Должностное лицо "${c['SURNAME']}" является владельцем кабинета ${cabMap.get(c['ISN_CABINET']) || ''}.
                                     Хотите сделать его владельцем данного кабинета (с переносом «его» документов)?`
                                    );
                                cabUserCount.set(c['ISN_CABINET'], cabUserCount.get(c['ISN_CABINET']) - 1);
                            });
                            testc.bodyList = mesageAr;
                            return this._confirmSrv.confirm2(testc)
                                .then((button) => {
                                    if (button && button.result === 1) {
                                        if (mesageAr2.length > 0) {
                                            const testc2: IConfirmWindow2 = Object.assign({}, CONFIRM_ADD_DL_UPDATE_CAB);
                                            testc2.bodyList = mesageAr2;
                                            this._confirmSrv.confirm2(testc2)
                                            .then((button2) => {
                                                if (button2 && button2.result === 1) {
                                                    this.getNewDepartUserDepartment(ans, cabinets);
                                                }
                                            });
                                        } else {
                                            this.getNewDepartUserDepartment(ans, cabinets);
                                        }
                                    } else {
                                        this.getNewDepartUserDepartment(ans.filter(us => !us['ISN_CABINET']), cabinets);
                                    }
                                });
                        });
                } else {
                    if (ans.length > 0) { // уведомдение для пользователей которые не принадлежать текущей картотеке
                        return this.getNewDepartUserDepartment(ans, cabinets);
                    } else {
                        return this._apiSrv.read({
                            DEPARTMENT: {
                                criteries: {
                                    DUE: due,
                                }
                            }
                        })
                        .then((depar) => {
                            this._msgSrv.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение',
                                msg: `Должностное лицо \'${depar[0]['SURNAME']}\' не принадлежит текущей картотеке`
                            });
                        });
                    }
                }
            })
            .catch(() => {
                console.log('window closed');
            });
    }
    getMaxOrderNum(): number {
        const maxOrder = this.getCabinetsOwners().sort((o1, o2) => {
            return String(+o1.orderNum).localeCompare(String(+o2.orderNum));
        });
        if (maxOrder.length) {
            const m = maxOrder[maxOrder.length - 1].orderNum;
            return !m ? 1 : m + 1;
        } else {
            return 1;
        }
    }
    getNewDepartUserDepartment(ans: DEPARTMENT[], cabinets) {
        let startIndex = this.data.owners.length;
        let cabinetsView = cabinets.length;
        const notAdd: string[] = [];
        ans.forEach((dep) => {
            if (dep['DEPARTMENT_DUE'] === this.data.department['DEPARTMENT_DUE']) {
                dep._orig = JSON.parse(JSON.stringify(dep));
                dep['ISN_CABINET'] = this.data.rec['ISN_CABINET'];
                dep['ORDER_NUM'] = cabinetsView + 1;
                this.data.owners.push(dep);
                const path = 'owners[' + startIndex + '].ISN_CABINET';
                const orderNum = 'owners[' + startIndex + '].ORDER_NUM';
                this.form.addControl(path, new FormControl(dep['ISN_CABINET']));
                this.form.addControl(orderNum, new FormControl(dep['ORDER_NUM']));
                const newCabinet = <ICabinetOwner>{
                    index: startIndex,
                    marked: false,
                    data: dep,
                    orderNum: dep['ORDER_NUM'],
                    get isOwnerView() {
                        return dep['ISN_CABINET'] === this.data['ISN_CABINET'];
                    },
                };
                this.cabinetOwners.push(newCabinet);
                this.add(newCabinet);
                cabinetsView++;
                startIndex++;
            } else {
                notAdd.push(dep['CLASSIF_NAME']);
            }
        });
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
        this.cabinetOwners
            .filter((owner) => owner.marked)
            .forEach((owner) => {
                let canceled = false;
                this._checkDeletion(owner.data['DUE'])
                    .then((result) => {
                        if (
                            result === 'DOC_FOLDER_NOT_EMPTY_BY_RESOLUTION' ||
                            result === 'DOC_FOLDER_NOT_EMPTY_BY_REPLY' ||
                            result === 'NP_FOLDER_NOT_EMPTY_BY_NP_ACL'
                        ) {
                            const testc: IConfirmWindow2 = Object.assign({}, CONFIRM_CABINET_NON_EMPTY);
                            testc.body = testc.body.replace('{{XXX}}', owner.data.CLASSIF_NAME);

                            return this._confirmSrv.confirm2(testc).then((button) => {
                                if (!button || button.result === 3) {
                                    canceled = true;
                                } else if (button.result === 1) {
                                    if (!this.data['updateTrules']) {
                                        this.data['updateTrules'] = [];
                                    }
                                    PipRX.invokeSop(this.data['updateTrules'], 'DepartmentCabinet_TRule', {
                                        due: owner.data['DUE'],
                                        ClearCabinet: 1,
                                        MoveCabinet: 0,
                                    });
                                }
                            });
                        }
                    })
                    .then(() => {
                        if (!canceled) {
                            const update = owner.data._orig['ISN_CABINET'] === this.data.rec.ISN_CABINET ? null : owner.data._orig['ISN_CABINET'];
                            if (update) { // если удалили пользователя которого добавили из Спавочника то удаляем его полностью
                                const path = 'owners[' + owner.index + '].ISN_CABINET';
                                const orderNum = 'owners[' + owner.index + '].ORDER_NUM';
                                this.form.removeControl(path);
                                this.form.removeControl(orderNum);
                                this.data.owners = this.data.owners.filter(dat => owner.data.DUE !== dat['DUE']);
                                this.cabinetOwners = this.cabinetOwners.filter(cab => owner.index !== cab.index);
                            }
                            this.setValue(this.getOwnerPath(owner.index), update);
                            owner.data['ISN_CABINET'] = update;
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

    userSort(type: number) {
        let indexes = [];
        this.cabinetOwners.filter((o) => {
            if (o.isOwnerView && o.marked) {
                return indexes.push({ item: o });
            }
        });
        if (type === 1) {
            indexes = indexes.reverse();
        }

        indexes.forEach((currentItem) => {
            const owners = this.getCabinetsOwners();
            const currentItemNode: ICabinetOwner = currentItem.item;
            const currentItemIndex = owners.findIndex((i) => i === currentItemNode);
            let replaceItem: ICabinetOwner;
            if (type === 1) {
                replaceItem = owners[currentItemIndex - 1];
            } else {
                replaceItem = owners[currentItemIndex + 1];
            }

            this.setValue(this.getOrderNumPath(currentItemNode.index), replaceItem.orderNum);
            this.setValue(this.getOrderNumPath(replaceItem.index), currentItemNode.orderNum);
            const oldOrderNum = currentItemNode.orderNum;
            currentItemNode.orderNum = replaceItem.orderNum;
            replaceItem.orderNum = oldOrderNum;
        });
        this.reorderNum();
    }
    getOrderNumPath(index: number): string {
        return 'owners[' + index + '].ORDER_NUM';
    }

    isOpenChange(dropdown: BsDropdownDirective) {
        localStorage.setItem('userSortCabinet', String(dropdown.isOpen));
        this.isUserSorted = dropdown.isOpen;
        this.resort(dropdown.isOpen);
    }

    private resort(isOpen) {
        if (isOpen) {
            this.reorderNum();
        } else {
            this.reorderCabinetOwners();
        }
    }

    private reorderNum() {
        this.cabinetOwners = this.cabinetOwners.sort((o1, o2) => {
            return String(+o1.orderNum).localeCompare(String(+o2.orderNum));
        });
    }
    private getCabinetsOwners(): ICabinetOwner[] {
        return this.cabinetOwners.filter((o) => o.isOwnerView);
    }

    private getOwnerPath(index: number) {
        return 'owners[' + index + '].ISN_CABINET';
    }

    private init(data: any) {
        this.cabinetOwners = [];
        this.dictSrv.getCabinetOwners(data.department.DEPARTMENT_DUE, this.data.rec['ISN_CABINET']).then((ans) => {
            data.owners = ans.owners;
            data.allOwner = ans.allOwners;
            Object.keys(this.form.controls).forEach((key) => {
                if (key.indexOf('owners') > -1) {
                    this.form.removeControl(key);
                }
            });
            this.cabinetOwners = ans.owners.map((owner, idx) => {
                const path = 'owners[' + idx + '].ISN_CABINET';
                const orderNum = 'owners[' + idx + '].ORDER_NUM';
                this.form.addControl(path, new FormControl(owner['ISN_CABINET']));
                this.form.addControl(orderNum, new FormControl(owner['ORDER_NUM']));

                return <ICabinetOwner>{
                    index: idx,
                    marked: false,
                    data: owner,
                    orderNum: owner['ORDER_NUM'],
                    get isOwnerView() {
                        return owner['ISN_CABINET'] === data.rec['ISN_CABINET'];
                    },
                };
            });

            this.getCabinetsOwners().forEach((owner) => {
                owner.orderNum = owner.data.ORDER_NUM || this.getMaxOrderNum();
            });
            // console.log(this.getCabinetsOwners());
            if (this.localUserSort) {
                this.reorderNum();
            } else {
                this.reorderCabinetOwners();
            }
        });

        this.cabinetFolders = CABINET_FOLDERS.filter((item) => (item.key !== 1 && item.key !== 6));

        this.accessHeaders = [
            {
                title: 'Ограничение доступа к РК',
                key: 'rk',
            },
            {
                title: 'Ограничение доступа к РКПД',
                key: 'rkpd',
            },
        ];

        this.cabinetUsers = [];
        data.users.forEach((user) => {
            const userAccess = data.cabinetAccess.find((access) => access.ISN_LCLASSIF === user.ISN_LCLASSIF);
            if (userAccess) {
                const cUser = {
                    fio: user.SURNAME_PATRON,
                    rk: userAccess.HIDE_INACCESSIBLE,
                    rkpd: userAccess.HIDE_INACCESSIBLE_PRJ,
                };
                this.cabinetFolders.forEach((folder) => {
                    cUser[folder.key] = userAccess.FOLDERS_AVAILABLE.indexOf(folder.charKey + '') > -1;
                });
                this.cabinetUsers.push(cUser);
            }
        });

        this.updateAccessMarks();
        this.updateOwnersMarks();

        // if (this._interval) {
        //     window.clearInterval(this._interval);
        // }
        // this._interval = setInterval(() => {
        //     this.updateScroller();
        // }, this.scrollInterval);
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
        return (this.allMarkedAccess = this.folderListControls.findIndex((ctrl) => ctrl.value) > -1);
    }

    private updateOwnersMarks(): boolean {
        return (this.allMarkedOwners =
            this.cabinetOwners.findIndex(
                (_person) => _person.marked && _person.data.ISN_CABINET === this.data.rec['ISN_CABINET']
            ) > -1);
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
