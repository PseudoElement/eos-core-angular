import { Component, OnInit } from '@angular/core';
import {LimitedAccesseService} from '../../shared/services/limited-access.service';
import { FormGroup, FormControl, FormArray} from '@angular/forms';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import {OPEN_CLASSIF_DOCGR } from '../../../eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { IMessage } from 'eos-common/interfaces';
@Component({
    selector: 'eos-right-limited-access',
    styleUrls: ['right-limited-access.component.scss'],
    templateUrl: 'right-limited-access.component.html'
})

export class RightLimitedAccessComponent implements OnInit {
    public isDefault = false;
    public statusBtnSub: boolean = true;
    public umailsInfo: Array<any>;
    public currentIndex: number;
    public delitedSetStore = new Set();
    public saveParams: any;
    public currentParams: string;
    public activeLink: boolean;
    public flagGrifs: boolean;
    public myForm: FormGroup;
    private ArrayForm: FormArray;
    constructor(
       private _limitservise: LimitedAccesseService,
       private _msgSrv: EosMessageService,
      private _waitClassifSrv: WaitClassifService,
    )   {
        this.activeLink = true;
        this.flagGrifs = true;
    }
    clearForm(): void {
        this.umailsInfo.splice(0, this.umailsInfo.length);
        this.resetForm();
        this.umailsInfo = this.saveParams.slice();
        this.sortArray(this.umailsInfo);
        this.sortArray(this.saveParams);
        if (this.saveParams.length) {
           // this.currentIndex = this.saveParams.length - 1;
        }
        this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
    }
    resetForm() {
        this.myForm.removeControl('groupForm');
        this.myForm.setControl('groupForm', this.createGroup(false, false, true));
    }
    saveAllForm(): void {
        Promise.all([
            this._limitservise.preAddNewDocument(this.ArrayForm),
            this._limitservise.preDelite(this.delitedSetStore),
            this._limitservise.preEdit(this.ArrayForm)])
        .then(result => {
            this._limitservise.getAccessCode()
            .then((params) => {
                if (params) {
                    this.umailsInfo.splice(0, this.umailsInfo.length);
                    this.saveParams = params.slice();
                    this.sortArray(this.saveParams);
                    this.delitedSetStore.clear();
                    this.resetForm();
                    this.umailsInfo =  this.saveParams.slice();
                    this.statusBtnSub = true;
                    this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
                    this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                }
                this._limitservise.subscribe.next(false);
            });
        }).catch(res => {
            const m: IMessage = {
                type: 'warning',
                title: 'Ошибка сервера',
                msg: 'Возможно изменения не сохранились',
            };
            this._msgSrv.addNewMessage(m);
        });
    }
    backForm(event): void {
        this.delitedSetStore.clear();
        this.clearForm();
        this._limitservise.subscribe.next(true);
    }

    chooseCurrentField(index: number): void {
        this.currentIndex = index;
    }
    deliteEmailFild(): void {
        if (this.currentIndex !== null || undefined) {
            this.preDelite();
            this.searchNeddedField();
        }
    }

    preDelite() {
        const delitedField  = this.ArrayForm.get(String(this.currentIndex));
        if (delitedField) {
              if (delitedField.value.newField !== true) {
            // в map добавлены только поля для удаления без флага true в форме, в свойсттве newField
            this.delitedSetStore.add(delitedField.value);
        }
    }

        this.ArrayForm.removeAt(this.currentIndex);
        this.umailsInfo.splice(this.currentIndex, 1);
    }

    searchNeddedField() {
        this.umailsInfo =  this.umailsInfo.filter((el, index) => {
            if (el[index] !== this.currentIndex) {
                return el;
            }
        });
        if (this.umailsInfo.length > 0) {
            this.currentIndex = 0;
        }
    }

    OpenClassiv(): void {
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DOCGR, true)
        .then(result_classif => {
            const newClassif = result_classif !== '' || null || undefined ? result_classif : '0.';
            this._limitservise.getCodeNameDOCGROUP(String(newClassif))
            .then(result => {
               const arrData = this.checkfield(result);
               arrData.forEach(el => {
                     const newField = {
                        NAME: el.CLASSIF_NAME,
                        DUE: el.DUE,
                        ALLOWED: el.ALLOWED
                    };
                    this.umailsInfo.push(newField);
                    this.addFormControls(newField, false, true);
                    this.currentIndex = this.umailsInfo.length - 1;
                    this.statusBtnSub = false;
                });
            });
        }).catch( error => {
            console.log('Окно закрыто');
        });
    }

    checkfield(param) {
        const arrach = this.umailsInfo;
        const filter = param.filter(function (el) {
           return !arrach.some( elenemt => {
              return  elenemt.DUE === el.DUE;
            });
        });
        return filter;
    }

    ngOnInit() {
        this._limitservise.getAccessCode()
        .then((result) => {
            this.umailsInfo = result.slice();
            this.sortArray(this.umailsInfo);
            this.saveParams =  this.umailsInfo.slice();
            this.umailsInfo.length > 0 ? this.currentIndex = 0 : this.currentIndex = null;
            this.createForm(false, false);
            this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
            this.myForm.valueChanges.subscribe(data => {
                this.checkChanges(data);
                });
        });
      }

      createForm(changedField: boolean, newField: boolean, flagBackForm?: boolean) {
        this.myForm = new FormGroup({'groupForm': this.createGroup(changedField, newField, flagBackForm)});
      }

      createGroup(changedField: boolean, newField: boolean, flagBackForm?: boolean): FormArray {
          let arrayField;
          const group = new FormArray([]);
          flagBackForm ? arrayField =  this.saveParams : arrayField =  this.umailsInfo;
          arrayField.forEach(element => {
            group.push(new FormGroup(this.createFormControls(element, changedField, newField)));
          });
          return group;
      }
      createFormControls(element, bool1, bool2): {[key: string]: FormControl} {
        const controls = {};
        controls['name'] = new FormControl(element.NAME);
        controls['due'] = new FormControl(element.DUE);
        controls['checkbox'] = new FormControl(Number(element.ALLOWED));
        controls['change'] = new FormControl(bool1);
        controls['newField'] = new FormControl(bool2);
        return controls;
      }
      checkChanges(data?: {[key: string]: Array<any>}) {
            let count_error = 0;
              this.umailsInfo.forEach((element, index) => {
                const checkedField = data.groupForm[index];
                const checkedData = element;
                if (checkedField) {
                    if (Number(checkedField['checkbox']) !== Number(checkedData['ALLOWED']) || checkedField['newField'] === true ) {
                        this.statusBtnSub = false;
                        this.myForm.get('groupForm')
                        .get(String(index))
                        .patchValue({change: true}, {emitEvent: false});
                        count_error++;
                    }else {
                        this.statusBtnSub = true;
                        this.myForm.get('groupForm')
                        .get(String(index))
                        .patchValue({change: false}, {emitEvent: false});
                    }
                }
              });
              if (this.delitedSetStore.size) {
                count_error++;
              }
              count_error > 0 ? this.statusBtnSub = false : this.statusBtnSub = true;
              count_error = 0;
      }

      addFormControls(newFieldEmail, change: boolean, newField: boolean ) {
        this.ArrayForm.push(new FormGroup(this.createFormControls(newFieldEmail, change, newField)));
    }


      sortArray (array) {
        array.sort(function(a, b){
            return a.DUE - b.DUE;
        });
    }

    changeActivelink() {
        this.activeLink = !this.activeLink;

    }
    SubscribtGrifs(event) {
console.log(event);

// flagGrifs
    }

}
