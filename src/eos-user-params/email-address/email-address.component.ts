import { Component, OnInit, TemplateRef} from '@angular/core';
import {EmailAddressService} from '../shared/services/email-address.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserParamsService } from '../shared/services/user-params.service';
import { FormGroup, FormControl, FormArray} from '@angular/forms';
import { NTFY_USER_EMAIL } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { IMessage } from 'eos-common/interfaces';
@Component({
    selector: 'eos-params-email-address',
    styleUrls: ['email-address.component.scss'],
    templateUrl: './email-address.component.html'
})

export class ParamEmailAddressComponent implements OnInit {
    public isDefault = false;
    public statusBtnSub: boolean = true;
    public username: string;
    public umailsInfo: Array<any>;
    public currentIndex: number;
    public prevIndex: number;
    public dismissible: boolean = true;
    public defaultAlerts: Map <string, any> = new Map();
    public alerts = Array.from(this.defaultAlerts);
    public modalRef: BsModalRef;
    public delitedSetStore = new Set();
    public seveForm: Set<any>;
    public editFalg: boolean;
    public editedEmail: string;
    public saveParams: any;
    public newEmail: string;
    public CODE: Map<string, string>;
    public currentParams: string;
    public childParams: Set<string> = new Set();
    public myForm: FormGroup;
    private ArrayForm: FormArray;
    constructor(
       private _emailService: EmailAddressService,
       private modalService: BsModalService,
       private _userServices: UserParamsService,
       private _msgSrv: EosMessageService,
    )   {
        this.currentParams = '';
        this.CODE = null;
        this.editFalg = false;
        this.username = this._userServices.curentUser['SURNAME_PATRON'];
        // для работы с формой создание, удаление, редакт.
        this.umailsInfo = this._userServices.curentUser['NTFY_USER_EMAIL_List'].slice();

        // для хранения первоночального состояния формы.
        this.saveParams = this.umailsInfo.slice();
        this.sortArray(this.umailsInfo);
        this.sortArray(this.saveParams);
        this.umailsInfo.length > 0 ? this.currentIndex = 0 : this.currentIndex = null;
        this.prevIndex = 0;
        this.umailsInfo.length > 0 ? this.newEmail = this.umailsInfo[0].EMAIL : this.newEmail = '';

    }
    clearForm(): void {
        this.umailsInfo.splice(0, this.umailsInfo.length);
        this.resetForm();
        this.umailsInfo = this.saveParams.slice();
        this.sortArray(this.umailsInfo);
        this.sortArray(this.saveParams);
        if (this.saveParams.length) {
            this.currentIndex = 0;
        }
        this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
    }
    resetForm() {
        this.myForm.removeControl('groupForm');
        this.myForm.setControl('groupForm', this.createGroup(false, false, true));
    }
    saveAllForm(event): void {
        console.log(this.ArrayForm);
        Promise.all([ this._emailService.preAddEmail(this.ArrayForm), this._emailService.preDeliteEmail(this.delitedSetStore), this._emailService.preEditEmail(this.ArrayForm)])
        .then(result => {
            this._userServices.getUserIsn(String(this._userServices.curentUser['ISN_LCLASSIF']))
            .then((flag: boolean) => {
                if (flag) {
                    this.umailsInfo.splice(0, this.umailsInfo.length);
                    this.saveParams =  this._userServices.curentUser['NTFY_USER_EMAIL_List'].slice();
                    this.saveParams =  this._emailService.Decode(this.saveParams, this.CODE).slice();
                    this.delitedSetStore.clear();
                    this.sortArray(this.umailsInfo);
                    this.sortArray(this.saveParams);
                    this.resetForm();
                    this.umailsInfo =  this.saveParams.slice();
                    this.statusBtnSub = true;
                    this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
                    this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                }
            });
        }).catch(res => {
            const m: IMessage = {
                type: 'warning',
                title: 'Ошибка сервера',
                msg: '',
            };
            this._msgSrv.addNewMessage(m);
        });
    }
    backForm(event): void {
        this.delitedSetStore.clear();
        this.clearForm();
    }
    openModal(template: TemplateRef<any>, edit?: boolean) {
        this.defaultAlerts.clear();
        this.childParams.clear();
        this.editFalg = false;
        this.newEmail = '';
        if (edit) {
            this.ArrayForm.length > 0 ? this.newEmail = this.ArrayForm.controls[this.currentIndex].value['email'] : this.newEmail = '';
            const params = this.ArrayForm.controls[this.currentIndex].value['params'];
            params === null || '' ? this.currentParams = null : this.currentParams = params;
            this.editFalg = true;

        }
        this.modalRef = this.modalService.show(template);

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
    createNewField(email: string): void {
         if (this.validEmail(email)) {
           this.createOrEdit(this.editFalg, email);
            }else {
                const m: IMessage = {
                    type: 'warning',
                    title: 'Не верное значение',
                    msg: '',
                };
             this._msgSrv.addNewMessage(m);
        }
    }

    getChildParams(event: Set<string>) {
        this.childParams = event;
    }
    createOrEdit(flag: boolean, email: string) {
        if (flag) {
            this.editEmail();
        } else {
            this.checkMail_PreSave(email);
        }
    }
    editEmail() {
        this.setEditEmail();
        // предполаголось редактирование почты с проверкой на уникальность
        // this._emailService.getAllEmails(email)
        // .then(result => {
        //         if (!result) {
        //         } else {
        //             this.setErrorEmail();
        //         }
        // });
    }
    setEditEmail() {
        this.myForm.get('groupForm').get(String(this.currentIndex)).patchValue({params: this.parseChildParams() === '' ? null : this.parseChildParams()});
        this.modalRef.hide();
    }
    parseChildParams() {
      return  Array.from(this.childParams).join(';');
    }

    checkMail_PreSave(email: string): void {
        this._emailService.getAllEmails(email)
        .then(result => {
            if (!result && !this.checkEmailCurrentfields(email)) {
                const newFieldEmail = {
                    ISN_USER: this._userServices.curentUser['ISN_LCLASSIF'],
                    EMAIL: email,
                    IS_ACTIVE: 0,
                    WEIGHT: this._emailService.getMaxWeigth(this.umailsInfo) + 1,
                    EXCLUDE_OPERATION: ''
                };
                this.statusBtnSub = true;
                this.umailsInfo.push(newFieldEmail);
                this.addFormControls(newFieldEmail, false, true);
                this.currentIndex = this.umailsInfo.length - 1;
                this.modalRef.hide();
            } else {
                const m: IMessage = {
                    type: 'warning',
                    title: 'Такая почта уже существует',
                    msg: '',
                };
                this._msgSrv.addNewMessage(m);
            }
        });
    }
    validEmail(email: string): boolean {
        const regul = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
        const regexp = RegExp(regul).test(email);
        return regexp;
    }

    onClosed(type): void {
        this.defaultAlerts.delete(type);
        this.alerts = Array.from(this.defaultAlerts);
      }

    ngOnInit() {
        this._emailService.getCode2()
        .then((map: Map<string, string>) => {
            this.sortArray(this.umailsInfo);
            this.sortArray(this.saveParams);
            this._emailService.Decode(this.umailsInfo, map);
            this.CODE = map;
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
      createFormControls(element: NTFY_USER_EMAIL, bool1, bool2): {[key: string]: FormControl} {
        const controls = {};
        controls['email'] = new FormControl(element.EMAIL);
        controls['checkbox'] = new FormControl(Number(element.IS_ACTIVE));
        controls['weigth'] = new FormControl(Number(element.WEIGHT));
        controls['params'] = new FormControl(element.EXCLUDE_OPERATION);
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
                    if (checkedField['email'] !== checkedData['EMAIL'] || Number(checkedField['checkbox']) !== Number(checkedData['IS_ACTIVE'])
                    || checkedField['params'] !== checkedData['EXCLUDE_OPERATION'] || checkedField['newField'] === true ) {
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

      addFormControls(newFieldEmail: NTFY_USER_EMAIL, change: boolean, newField: boolean ) {
        this.ArrayForm.push(new FormGroup(this.createFormControls(newFieldEmail, change, newField)));
    }

      upWeight() {
        this.currentIndex = this.currentIndex - 1;
        this.prevIndex = this.currentIndex + 1;
        this.getSetValues();
      }

      downWeight() {
        this.currentIndex = this.currentIndex + 1;
        this.prevIndex = this.currentIndex - 1;
        this.getSetValues();
      }
      getSetValues() {
        const current = this.ArrayForm.controls[this.currentIndex].value;
        const prev = this.ArrayForm.controls[this.prevIndex].value;
        const controlInfo =  this.arrChangesValues(current, prev);
        this.changeCurrentWeight(controlInfo);
      }
     arrChangesValues(current, prev): Array<Array<any>> {
          const T = [[], []];

          let CurrentParams = {};
          let PrevParams = {};
          const params = this.constParams();
          const length = this.constParams().length;
          for (let i = 0; i < length; i += 1) {
            CurrentParams[params[i]] = current[params[i]];
            PrevParams[params[i]] = prev[params[i]];
            T[0].push(CurrentParams);
            T[1].push(PrevParams);
            PrevParams = {};
            CurrentParams = {};
          }
          return T;
      }
      changeCurrentWeight(controlsInfo) {
          const countArray = controlsInfo[0].length - 1;
            for (let i = 0; i < countArray; i += 1) {
                if ( i !== countArray - 1) {
                    this.myForm.get('groupForm')
                    .get(String(this.currentIndex))
                    .patchValue(controlsInfo[1][i], {emitEvent: false});
                    this.myForm.get('groupForm')
                    .get(String(this.prevIndex))
                    .patchValue(controlsInfo[0][i], {emitEvent: false});
                } else {
                    this.myForm.get('groupForm')
                    .get(String(this.currentIndex))
                    .patchValue(controlsInfo[1][i], {emitEvent: false});
                    this.myForm.get('groupForm')
                    .get(String(this.prevIndex))
                    .patchValue(controlsInfo[0][i]);
                }
            }
      }

      constParams (): Array<string> {
          return ['email', 'checkbox', 'params', 'change', 'newField'];
      }

      checkEmailCurrentfields(email: string): boolean {
          if ( this.umailsInfo.length > 0 ) {
            return  this.umailsInfo.some(element => {
                    return  element.EMAIL === email;
              });
          }
          return false;
      }

    get getaccess() {
          return  this.umailsInfo.length <= 0 ? true : false;
      }

      sortArray (array: NTFY_USER_EMAIL[]) {
        array.sort(function(a, b){
            return a.WEIGHT - b.WEIGHT;
        });
      }

}
