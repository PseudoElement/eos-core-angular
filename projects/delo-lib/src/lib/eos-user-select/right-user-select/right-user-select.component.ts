import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// import {EosSandwichService} from 'eos-dictionaries/services/eos-sandwich.service';
import { RtUserSelectService } from '../../eos-user-select/shered/services/rt-user-select.service';
import { USER_CL, DEPARTMENT, USER_PARMS, ExetentionsUserParamsLib } from '../../eos-rest';
import { DELO_BLOB } from '../../eos-rest/interfaces/structures';
import { RECENT_URL } from '../../app/consts/common.consts';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { UserSelectNode } from '../../eos-user-select/list-user-select/user-node-select';
import { ErrorHelperServices } from '../../eos-user-params/shared/services/helper-error.services';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { KIND_ROLES_CB } from '../../eos-user-params/shared/consts/user-param.consts';

@Component({
    selector: 'eos-right-user-select',
    templateUrl: 'right-user-select.component.html'
})

export class RightUserSelectComponent implements OnInit, OnDestroy {
    flagRtBlock: boolean;
    showDep: boolean;
    CurrentUser: UserSelectNode = null;
    ctf: UserSelectNode;
    UserCabinetInfo: any;
    DueInfo: string;
    role: string | boolean | string[];
    flagSustem: boolean;
    openedAccessSystems: boolean;
    openedRole: boolean;
    chooseTemplate: string;
    isPhoto: boolean | number;
    urlPhoto: string = '';
    departmentInfo: DEPARTMENT;
    destroySubsriber: Subject<any> = new Subject();
    flagFirstGetInfo: boolean = true;
    public departments: string;
    get disableLink() {
        return this._appContext.CurrentUser.IS_SECUR_ADM || !this.CurrentUser.isEditable;
    }
    constructor(
        public _selectedUser: RtUserSelectService,
        private _storageSrv: EosStorageService,
        private _router: Router,
        private _errSrv: ErrorHelperServices,
        public _appContext: AppContext,
        private _extensionsUser: ExetentionsUserParamsLib
    ) {
        this.isPhoto = false;
        this.chooseTemplate = 'preview';
        this.flagSustem = false;
        this.openedAccessSystems = false;
        this.openedRole = true
        this.showDep = false;
        this._selectedUser.changerUser
            .pipe(
                takeUntil(this.destroySubsriber)
            )
            .subscribe(currentUser => {
                this._storageSrv.setItem('selected_user_save', currentUser, false);
                this.CurrentUser = currentUser;
                if ((currentUser && this.flagFirstGetInfo) || (currentUser && this._selectedUser.updateSettings)) {
                    this.chooseTemplate = 'spinner';
                    this.geyInfo(currentUser);
                    this.ctf = currentUser;
                    this.flagFirstGetInfo = false;
                    this._selectedUser.updateSettings = false;
                }
                if (currentUser && this.ctf['id'] !== currentUser.id) {
                    this.chooseTemplate = 'spinner';
                    this.geyInfo(currentUser);
                    this.ctf = currentUser;
                }
                if (this.CurrentUser) {
                    if (this.CurrentUser.data.NOTE === 'null') {
                        this.CurrentUser.data.NOTE = null;
                    }
                }
            });
    }

    async geyInfo(currentUser) {
        let isn;
        if (currentUser['deep'] && currentUser['deep'] !== 'null') {
            isn = currentUser['deep'];
        }
        if (isn) {
            this.getInfo(isn);
        } else {
            this.getInfo();
            this.showDep = false;
        }

        const deep = await this._extensionsUser.loadDepartments(this.CurrentUser.data.TECH_DUE_DEP || '');
        if (deep) {
            this.departments = deep;
        } else {
            this.departments = this.CurrentUser.data.NOTE ? this.CurrentUser.data.NOTE : 'Не указано';
        }
    }

    parseSustemParam(parseParam) {
        return parseParam.split('');
    }

    writeRecentUrl() {
        this._storageSrv.setItem(RECENT_URL, this._router.url);
    }

    getInfo(isnDue?): void {
        let isn_cabinet = null;
        if (!isnDue) {
            this.isPhoto = false;
        }
        const savedUser = this._selectedUser.hashUsers.get(this.CurrentUser.id);
        if (savedUser) {
            this.DueInfo = savedUser.DueInfo;
            this.departmentInfo = savedUser.departmentInfo;
            this.UserCabinetInfo = savedUser.UserCabinetInfo;
            this.role = savedUser.role;
            this.CurrentUser = savedUser.CurrentUser;
            this.chooseTemplate = 'main';
            if (this.CurrentUser.deep) {
                this.isPhoto = this.departmentInfo['ISN_PHOTO'];
                if (this.isPhoto) {
                    this.urlPhoto = savedUser.urlPhoto;
                }
            }
            this.getObjectForSystems();
        } else if(this.CurrentUser) {
            this._selectedUser.get_cb_print_info(this.CurrentUser.id, isnDue, this._appContext)
                .then(([user_role, deep = null, cb_print = null, cb_role = null]) => {
                    this.getObjectForSystems();
                    if (this.CurrentUser.deep) {
                        this.departmentInfo = deep;
                        if (cb_print && cb_print.length) {
                            const surname = `${cb_print[0].SURNAME}`;
                            const name = `${cb_print[0].NAME}`;
                            const lastName = `${cb_print[0].PATRON}`;
                            this.DueInfo = `${String(surname) !== 'null' ? surname : ''} ${String(name) !== 'null' ? name : ''}  ${String(lastName) !== 'null' ? lastName : ''}`;
                            if (this.DueInfo.trim().length === 0) {
                                this.DueInfo = `${deep['SURNAME']}`;
                            }
                        } else {
                            this.DueInfo = `${deep['SURNAME']}`;
                        }
                        this.isPhoto = deep['ISN_PHOTO'];
                        isn_cabinet = deep['ISN_CABINET'];
                        this.showDep = true;
                        if (this.isPhoto) {
                            this._selectedUser.getSVGImage(this.isPhoto).then((res: DELO_BLOB[]) => {
                                this.urlPhoto = this.createUrlRoot(res[0]);
                            });
                        }
                    } else {
                        this.DueInfo = null;
                        this.showDep = false;
                    }
                    this.role = this.getRoleForUser(user_role, cb_role);
                    if (this.CurrentUser) {
                        this._selectedUser.getInfoCabinet(this.CurrentUser.id, isn_cabinet)
                        .then((res: [USER_CL, DEPARTMENT]) => {
                            this.UserCabinetInfo = res;
                            this.chooseTemplate = 'main';
                            this.hashUsers();
                        });
                    }
                })
                .catch(error => {
                    this._errSrv.errorHandler(error);
                });
        }
    }

    hashUsers() {
        if (!this._selectedUser.hashUsers.has(this.CurrentUser.id)) {
            const user = {
                CurrentUser: this.CurrentUser,
                DueInfo: this.DueInfo,
                departmentInfo: this.departmentInfo,
                UserCabinetInfo: this.UserCabinetInfo,
                role: this.role,
                urlPhoto: this.urlPhoto
            };
            this._selectedUser.hashUsers.set(this.CurrentUser.id, user);
        }
    }
    createUrlRoot(blob: DELO_BLOB) {
        const url = `url(data:image/${blob.EXTENSION};base64,${blob.CONTENTS})`;
        return url;
    }

    getRoleForUser(array: USER_PARMS[], cb_role: Array<any>): string | string[] {
        if(this._appContext.cbBase) {
            const roleName: string[] = [];
            if (cb_role && cb_role.length) {
                cb_role.forEach(el => {
                    const id = el['KIND_ROLE'];
                    roleName.push(KIND_ROLES_CB[id-1])
                })
            }
            if (array[0] && array[0].PARM_VALUE) {
                roleName.push(array[0].PARM_VALUE);
            }
            return roleName;
        }

        if (array[0]) {
            return array[0].PARM_VALUE ? array[0].PARM_VALUE : 'Не указана';
        } else {
            return 'Не указана';
        }
    }

    getObjectForSystems(): void {
        if (this.CurrentUser) {
            const split = this.parseSustemParam(this.CurrentUser['data']['AV_SYSTEMS']);
            const isDeloWebLGOChecked = split[1] === '1'//ДЕЛО-WEB Личная
            const isDeloWebKLChecked = split[27] === '1' //Дело-WEB Конкурентная
            this.fillDeloField(isDeloWebLGOChecked, isDeloWebKLChecked)
    
            this._selectedUser.ArraySystemHelper.MobileApp.checked = split[25] === '1' ? true : false
            this._selectedUser.ArraySystemHelper.SCAN.checked = split[2] === '1' ? true : false
            this._selectedUser.ArraySystemHelper.Pscan.checked = split[3] === '1' ? true : false
            this._selectedUser.ArraySystemHelper.Shif.checked = split[5] === '1' ? true : false
            this._selectedUser.ArraySystemHelper.Scan_code.checked = split[15] === '1' ? true : false
            this._selectedUser.ArraySystemHelper.Notifer.checked = split[16] === '1' ? true : false
            this._selectedUser.ArraySystemHelper.Search_code.checked = split[17] === '1' ? true : false
            this._selectedUser.ArraySystemHelper.EDITORMO.checked = split[41] === '1' ? true : false
            // split[21] === '1' ? this._selectedUser.ArraySystemHelper.EOS.checked = true : this._selectedUsВer.ArraySystemHelper.EOS.checked = false;
            // split[23] === '1' ? this._selectedUser.ArraySystemHelper.MobNet.checked = true : this._selectedUser.ArraySystemHelper.MobNet.checked = false;
            /* split[26] === '1' ? this._selectedUser.ArraySystemHelper.Informer.checked = true : this._selectedUser.ArraySystemHelper.Informer.checked = false; */
            this.flagSustem = true;
        }
    }
    fillDeloField(delowebLGO: boolean, delowebKL: boolean): void {
        this._selectedUser.ArraySystemHelper.delowebLGO.checked = delowebLGO;
        this._selectedUser.ArraySystemHelper.delowebKL.checked = delowebKL;
    }

    togleParam(nameParam: string): void {
        this[nameParam] = !this[nameParam];
    }

    ngOnDestroy() {
        this.destroySubsriber.next();
        this.destroySubsriber.complete();
    }

    ngOnInit() {
        this.DueInfo = null;
    }
}

