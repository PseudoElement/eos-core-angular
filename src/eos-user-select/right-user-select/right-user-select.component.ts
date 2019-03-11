import { Component, OnInit, OnDestroy} from '@angular/core';
// import {EosSandwichService} from 'eos-dictionaries/services/eos-sandwich.service';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';
import { USER_CL, DEPARTMENT, USER_PARMS } from 'eos-rest';
import { Subject } from 'rxjs/Subject';
import {DELO_BLOB} from 'eos-rest/interfaces/structures';

@Component({
    selector: 'eos-right-user-select',
    templateUrl: 'right-user-select.component.html'
})

export class RightUserSelectComponent  implements OnInit, OnDestroy {
    flagRtBlock: boolean;
    showDep: boolean;
    CurrentUser: USER_CL;
    UserCabinetInfo:  any;
    DueInfo: string;
    role: string | boolean;
    flagSustem: boolean;
    opened: boolean;
    chooseTemplate: string;
    isPhoto: boolean|number;
    urlPhoto: string = '';
    departmentInfo: DEPARTMENT;
    destroySubsriber: Subject<any> = new Subject();
    flagFirstGetInfo: boolean = true;
    CurrentUserForShowTemplate: USER_CL = null;
    constructor(
      //  private _sandwichSrv: EosSandwichService,
        private _selectedUser: RtUserSelectService,
    ) {
        this.isPhoto = false;
        this.chooseTemplate = 'preview';
        this.flagSustem = false;
        this.opened = false;
        this.showDep = false;
        // this._sandwichSrv.currentDictState$
        //     .takeUntil(this.destroySubsriber)
        //     .subscribe(result => {
        //     this.flagRtBlock = result[1];
        //     if (this.flagRtBlock && this.CurrentUser) {
        //         this.chooseTemplate = 'spinner';
        //             this.geyInfo();
        //         }
        //     });

        this._selectedUser.changerUser
            .takeUntil(this.destroySubsriber)
            .subscribe(currentUser => {
                this.CurrentUserForShowTemplate  = currentUser;
                if (currentUser && this.flagFirstGetInfo) {
                    this.chooseTemplate = 'spinner';
                    this.geyInfo(currentUser);
                    this.CurrentUser = currentUser;
                    this.flagFirstGetInfo = false;
                }
                if (currentUser &&  this.CurrentUser['id'] !== currentUser.id ) {
                    // if (this.flagRtBlock) {
                    //     this.chooseTemplate = 'spinner';
                    //     this.geyInfo();
                    // }
                         this.chooseTemplate = 'spinner';
                         this.geyInfo(currentUser);
                         this.CurrentUser = currentUser;
                }
            });
    }
    geyInfo(currentUser) {
        const isn = currentUser['data']['ISN_LCLASSIF'];
        if ( currentUser['data']['DUE_DEP'] !== null) {
            const due =  currentUser['data']['DUE_DEP'];
                this.getInfo(isn, due);
            }else {
                this.getInfo(isn);
                this.showDep = false;
            }
    }

    parseSustemParam(parseParam) {
        return parseParam.split('');
    }

    getInfo(isn, due?): void {
        let isn_cabinet = null;
        if (!due) {
            this.isPhoto = false;
        }
        this._selectedUser.getUserIsn(isn, due)
        .then((result: [USER_CL, DEPARTMENT]) => {
            this.getObjectForSystems(result);
           if (result[1].toString() !== '5') {
               this.departmentInfo = result[1][0];
               if (result[1][1] === undefined) {
                this.DueInfo = `${result[1][0]['SURNAME']}`;
               }    else {
                this.DueInfo = `${result[1][1]['SURNAME']} ${result[1][1]['NAME']} ${result[1][1]['PATRON']}`;
               }
            this.isPhoto =  result[1][0]['ISN_PHOTO'];
            isn_cabinet =  result[1][0]['ISN_CABINET'];
            this.showDep = true;
            if (this.isPhoto) {
                this._selectedUser.getSVGImage(this.isPhoto).then((res: DELO_BLOB[]) => {
                this.urlPhoto =  this.createUrlRoot(res[0]);
                });
            }
           }else {
            this.DueInfo = null;
            this.showDep = false;
           }
            this.role = this.getRoleForUser(result[0]['USER_PARMS_List']);
            this._selectedUser.getInfoCabinet(isn, isn_cabinet)
            .then((res: [USER_CL, DEPARTMENT]) => {
                this.UserCabinetInfo = res;
                setTimeout(() => {
                this.chooseTemplate = 'main';
            }, 100);
        });
        });
    }

    createUrlRoot(blob: DELO_BLOB) {
        const url = `url(data:image/${blob.EXTENSION};base64,${blob.CONTENTS})`;
        return url;
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
            return 'Не указанна';
        }
    }

    getObjectForSystems(infoUser): void {
        const split =  this.parseSustemParam(infoUser[0]['AV_SYSTEMS']);
        const delo = !!(+split[0] && !+split[1]);
        const delo_deloWeb = !!(+split[0] && +split[1]);
        const deloWeb = !!((+split[1] || +split[27]) && !+split[0]);
        if (!delo && !delo_deloWeb && !deloWeb) {
            this.fillDeloField(false, false, false, false);
        } else {
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
        }

            split[25] === '1' ?  this._selectedUser.ArraySystemHelper.APM.checked = true :  this._selectedUser.ArraySystemHelper.APM.checked = false;
            split[21] === '1' ?  this._selectedUser.ArraySystemHelper.EOS.checked = true : this._selectedUser.ArraySystemHelper.EOS.checked = false;
            split[2] === '1' ?  this._selectedUser.ArraySystemHelper.SCAN.checked = true : this._selectedUser.ArraySystemHelper.SCAN.checked = false;
            split[3] === '1' ?    this._selectedUser.ArraySystemHelper.Pscan.checked = true :   this._selectedUser.ArraySystemHelper.Pscan.checked = false;
            split[5] === '1' ?  this._selectedUser.ArraySystemHelper.Shif.checked = true : this._selectedUser.ArraySystemHelper.Shif.checked = false;
            split[15] === '1' ?   this._selectedUser.ArraySystemHelper.Scan_code.checked = true :  this._selectedUser.ArraySystemHelper.Scan_code.checked = false;
            split[16] === '1' ? this._selectedUser.ArraySystemHelper.Notifer.checked = true : this._selectedUser.ArraySystemHelper.Notifer.checked = false;
            split[17] === '1' ?  this._selectedUser.ArraySystemHelper.Search_code.checked = true : this._selectedUser.ArraySystemHelper.Search_code.checked = false;
            split[23] === '1' ?  this._selectedUser.ArraySystemHelper.MobNet.checked = true : this._selectedUser.ArraySystemHelper.MobNet.checked = false;
            split[26] === '1' ?  this._selectedUser.ArraySystemHelper.Informer.checked = true : this._selectedUser.ArraySystemHelper.Informer.checked = false;
            this.flagSustem = true;
            this._selectedUser.subjectScan.next(this._selectedUser.ArraySystemHelper.Pscan.checked);
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

