import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
// import { FormGroup, FormControl, FormArray} from '@angular/forms';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
// import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import {LimitedAccesseService} from '../../../shared/services/limited-access.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
    @Output() changeGrifs = new EventEmitter();
    constructor(
        private _limitservise: LimitedAccesseService,
    ) {
        this.flagChande = true;
        this._limitservise.subscribe.subscribe(data => {
            if (!this.flagChande) {
               if (data) {
                   this.reset();
               }else {
                this.updateInfo();
               }
            }
        });
    }
    reset() {
        const prom = this.saveOrigin.slice();
        this.saveOrigin.splice(0,  this.saveOrigin.length);
        this.myForm.removeControl('grifs');
        this.grifsForm = new FormArray([]);
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
                arrList.forEach(arrl => {
                    if (el.SECURLEVEL === arrl.SECURLEVEL) {
                        arrObj['checkbox'] = true;
                    }else {
                        arrObj['checkbox'] = false;
                    }
                });
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
        data.forEach(el => {
            this.grifsForm.push(new FormGroup(this.createFormControls(el, false)));
        });
        return  this.grifsForm;
    }

    createFormControls(element, bool1): {[key: string]: FormControl} {
        const controls = {};
        controls['level'] = new FormControl(element.SECURLEVEL);
        controls['name'] = new FormControl(element.GRIF_NAME);
        controls['checkbox'] = new FormControl(element.checkbox);
        controls['action'] = new FormControl('unset');
        return controls;
      }

      checkChanges(data?: {[key: string]: Array<any>}) {
        let count_error = 0;
          this.saveOrigin.forEach((element, index) => {
           const checkedField = data.grifs[index];
            const checkedData = element;
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
    });
    this.changeGrifs.emit( {flag: this.flagChande, form:  this.grifsForm });
  }
  ngOnDestroy() {
  }
}
