import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import {LimitedAccesseService} from '../../../shared/services/limited-access.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { UserParamsService } from '../../../shared/services/user-params.service';
@Component({
    selector: 'eos-grifs',
    styleUrls: ['grifs.component.scss'],
    templateUrl: 'grifs.component.html'
})
export class GrifsComponent implements OnInit, OnDestroy {
    public grifsForm: FormArray = new FormArray([]);
    public myForm: FormGroup;
    saveOrigin: any;
    flagChande: boolean;
    Unsub = new Subject();
    @Output() changeGrifs = new EventEmitter();
    constructor(
        private _limitservise: LimitedAccesseService,
        private _userServices: UserParamsService,
    ) {
        this.flagChande = true;
        this._limitservise.subscribe.takeUntil(this.Unsub).subscribe(data => {
               if (data) {
                   this.reset();
               }else {
                this.updateInfo();
               }
        });
    }
    reset() {
        const prom = this.saveOrigin.slice();
        this.saveOrigin.splice(0,  this.saveOrigin.length);
        this.myForm.removeControl('grifs');
        this.grifsForm = new FormArray([]);
        localStorage.removeItem(String(this._userServices.userContextId));
        this.myForm.setControl('grifs', this.createGroup(prom));
        this.saveOrigin = prom;
    }

    updateInfo() {
        this._limitservise.getInfoGrifs()
        .then(res => {
            this.saveOrigin.splice(0,  this.saveOrigin.length);
            this.myForm.removeControl('grifs');
            this.grifsForm = new FormArray([]);
            const newt = this.relaseDate(res);
           // localStorage.removeItem(String(this._userServices.userContextId));
            this.myForm.setControl('grifs', this.createGroup(newt));
            this.saveOrigin = newt.slice();
        });
    }
    ngOnInit() {
        this._limitservise.getInfoGrifs()
        .then(res => {
            this.saveOrigin = this.relaseDate(res).slice();
            this.createGroup(this.saveOrigin);
            this.creatFrorm();
            this.myForm.valueChanges
            .subscribe( data => {
                this.checkChanges(data);
            });
        });
    }


    relaseDate(res: Array<any>) {
        const arraData = [];
        let arrObj = {};
        const arrList = res[0][0].USERSECUR_List;
        if (res[1].length > 0) {
            res[1].forEach(el => {
               const tre = arrList.some( ele => {
                   return el.SECURLEVEL === ele.SECURLEVEL;
               });
               if (tre) {
                arrObj['checkbox'] = true;
               }else {
                     arrObj['checkbox']  = false;
               }
                arrObj['SECURLEVEL'] = el.SECURLEVEL;
                arrObj['GRIF_NAME'] = el.GRIF_NAME;
                arraData.push(arrObj);
                arrObj = {};
            });
        }
        return arraData;
    }
    creatFrorm() {
        this.myForm = new FormGroup({'grifs':  this.grifsForm});

    }
    createGroup(data) {
        let dataUpdate = null;
        if (localStorage.getItem(String(this._userServices.userContextId))) {
             dataUpdate = JSON.parse(localStorage.getItem(String(this._limitservise.CurrentUser['ISN_LCLASSIF'])));
        }
        let endDate = null;
        if (dataUpdate) {
            endDate = dataUpdate;
        }else {
            endDate = data;
        }
        endDate.forEach(el => {
            this.grifsForm.push(new FormGroup(this.createFormControls(el, false)));
        });
        return  this.grifsForm;
    }

    createFormControls(element, bool1): {[key: string]: FormControl} {
        const controls = {};
        controls['SECURLEVEL'] = new FormControl(element.SECURLEVEL);
        controls['GRIF_NAME'] = new FormControl(element.GRIF_NAME);
        controls['checkbox'] = new FormControl(element.checkbox);
        controls['action'] = new FormControl('unset');
        return controls;
      }

    checkChanges(data?: {[key: string]: Array<any>}) {
        let count_error = 0;
        const storage = [];
          this.saveOrigin.forEach((element, index) => {
           const checkedField = data.grifs[index];
            const checkedData = element;
            storage.push(checkedField);
            if (checkedField) {
                if (Number(checkedField['checkbox']) !== Number(checkedData['checkbox']) && Number(checkedField['checkbox']) > Number(checkedData['checkbox']) ) {
                    this.grifsForm.get(String(index))
                    .patchValue({action: 'create'}, {emitEvent: false});
                    count_error++;
                } else if (Number(checkedField['checkbox']) !== Number(checkedData['checkbox']) && Number(checkedField['checkbox']) < Number(checkedData['checkbox'])) {
                    this.grifsForm.get(String(index))
                    .patchValue({action: 'delite'}, {emitEvent: false});
                    count_error++;
                } else if (Number(checkedField['checkbox']) === Number(checkedData['checkbox'])) {
                    this.grifsForm.get(String(index))
                    .patchValue({action: 'unset'}, {emitEvent: false});
                }
                if (count_error > 0) {
                    this.flagChande = false;
                }else {
                    this.flagChande = true;
                }
            }
            localStorage.setItem(String(this._userServices.userContextId), JSON.stringify(storage));
    });
    this.changeGrifs.emit( {flag: this.flagChande, form:  this.grifsForm });
  }
  ngOnDestroy() {
    this.Unsub.next();
    this.Unsub.complete();
  }
}
