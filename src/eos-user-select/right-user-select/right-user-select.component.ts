import { Component, OnInit, OnDestroy} from '@angular/core';
import {EosSandwichService} from 'eos-dictionaries/services/eos-sandwich.service';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';
import { USER_CL, DEPARTMENT, USER_PARMS } from 'eos-rest';
import { Subject } from 'rxjs/Subject';
@Component({
    selector: 'eos-right-user-select',
    templateUrl: 'right-user-select.component.html'
})

export class RightUserSelectComponent  implements OnInit, OnDestroy {
    flagRtBlock: boolean;
    showDep: boolean;
    CurrentUser: USER_CL;
    UserCabinetInfo:  any;
    DueInfo: DEPARTMENT;
    role: string | boolean;
    flagSustem: boolean;
    opened: boolean;
    chooseTemplate: string;
    destroySubsriber: Subject<any> = new Subject();
    constructor(
        private _sandwichSrv: EosSandwichService,
        private _selectedUser: RtUserSelectService
    ) {
        this.chooseTemplate = 'preview';
        this.flagSustem = false;
        this.opened = false;
        this.showDep = false;
        this._sandwichSrv.currentDictState$
            .takeUntil(this.destroySubsriber)
            .subscribe(result => {
            this.flagRtBlock = result[1];
            });

        this._selectedUser.changerUser
            .takeUntil(this.destroySubsriber)
            .subscribe(currentUser => {
                if (currentUser) {
                    this.CurrentUser = currentUser;
                    const isn = currentUser.data['ISN_LCLASSIF'];
                    if (this.flagRtBlock) {
                        this.chooseTemplate = 'spinner';
                        if ( currentUser.data['DUE_DEP'] !== null) {
                        const due = currentUser.data['DUE_DEP'];
                            this.getInfo(isn, due);
                        }else {
                            this.getInfo(isn);
                            this.showDep = false;
                        }
                }
                }
            });
    }

    parseSustemParam(parseParam) {
        return parseParam.data.AV_SYSTEMS.split('');
    }

    getInfo(isn, due?): void {
        this.getObjectForSystems();
        this._selectedUser.getUserIsn(isn, due)
        .then((result: [USER_CL, DEPARTMENT]) => {
            console.log(result);
           if (result[1].toString() === '[object Object]') {
            this.DueInfo = result[1];
            this.showDep = true;
           }else {
            this.DueInfo = null;
            this.showDep = false;
           }
            this.role = this.getRoleForUser(result[0]['USER_PARMS_List']);
            this._selectedUser.getInfoCabinet(isn)
            .then((res: [USER_CL, DEPARTMENT]) => {
                this.UserCabinetInfo = res;
                setTimeout(() => {
                this.chooseTemplate = 'main';
            }, 500);
             });
        });
    }

    getRoleForUser(array: USER_PARMS[]): string {

        const role = array.filter(el => {
            if (el.PARM_NAME === 'CATEGORY' ) {
                return el;
            }
        });
        if (role[0].PARM_VALUE) {
             return role[0].PARM_VALUE;
        }else {
            return 'не указанно';
        }
    }

    getObjectForSystems(): void {
        const split =  this.parseSustemParam(this.CurrentUser);
        const delo = !!(+split[0] && !+split[1]);
        const delo_deloWeb = !!(+split[0] && +split[1]);
        const deloWeb = !!((+split[1] || +split[27]) && !+split[0]);
        if (delo) {
            this.fillDeloField(true, false, false, false);
        }else if (delo_deloWeb) {
            this.fillDeloField(false, true, false, false);
        }else if (!delo_deloWeb && deloWeb) {
            if (+split[1] && !+split[27] && !+split[0]) {
                this.fillDeloField(false, false, true, false);
            }else if (!+split[1] && +split[27] && !+split[0]) {
                this.fillDeloField(false, false, false, true);
            }
        }
        if ( split[25] === '1') {
            this._selectedUser.ArraySystemHelper.APM.checked = true;
        }else if ( split[21] === '1') {
            this._selectedUser.ArraySystemHelper.EOS.checked = true;
        }else if ( split[2] === '1' ) {
            this._selectedUser.ArraySystemHelper.SCAN.checked = true;
        }else if ( split[3] === '1' ) {
            this._selectedUser.ArraySystemHelper.Pscan.checked = true;
        }else if (  split[5] === '1') {
            this._selectedUser.ArraySystemHelper.Shif.checked = true;
        }else if ( split[15] === '1' ) {
            this._selectedUser.ArraySystemHelper.Scan_code.checked = true;
        }else if ( split[16] === '1') {
            this._selectedUser.ArraySystemHelper.Notifer.checked = true;
        }else if ( split[17] === '1') {
            this._selectedUser.ArraySystemHelper.Search_code.checked = true;
        }else if ( split[23] === '1') {
            this._selectedUser.ArraySystemHelper.MobNet.checked = true;
        }else if ( split[26] === '1') {
            this._selectedUser.ArraySystemHelper.Informer.checked = true;
        }
        this.flagSustem = true;
    }
    fillDeloField(delo: boolean, delo_deloweb: boolean, delowebLGO: boolean, delowebKL: boolean ): void {
        this._selectedUser.ArraySystemHelper.delo.checked = delo;
        this._selectedUser.ArraySystemHelper.delo_deloweb.checked = delo_deloweb;
        this._selectedUser.ArraySystemHelper.delowebLGO.checked = delowebLGO;
        this._selectedUser.ArraySystemHelper.delowebKL.checked = delowebKL;
    }
    openedSustem(): void {
        this.opened = !this.opened;
    }

    ngOnDestroy() {
        this.destroySubsriber.next();
        this.destroySubsriber.complete();
    }

    ngOnInit() {
        this.DueInfo = null;
     }
}

