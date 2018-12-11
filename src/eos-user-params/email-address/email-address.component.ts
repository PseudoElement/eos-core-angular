import { Component, OnInit, TemplateRef} from '@angular/core';
import {EmailAddressService} from '../shared/services/email-address.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserParamsService } from '../shared/services/user-params.service';
import { FormGroup, FormControl, FormArray} from '@angular/forms';
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
    public dismissible: boolean = true;
    public defaultAlerts: Map <string, any> = new Map();
    public alerts = Array.from(this.defaultAlerts);
    public modalRef: BsModalRef;
    public delitedSetStore = new Set();
    private myForm: FormGroup;

    constructor(
       private _emailService: EmailAddressService,
       private modalService: BsModalService,
       private _userServices: UserParamsService,
    )   {
        this.username = this._userServices.curentUser['SURNAME_PATRON'];
        this.umailsInfo = this._userServices.curentUser['NTFY_USER_EMAIL_List'];
        this._emailService.Decode();
        this.currentIndex = 0;
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
      }
    chooseCurrentField(field) {
        this.currentIndex = field;
    }
    deliteEmailFild() {
        if (!this.currentIndex) {
            // gjrfpfnm ghtleght;ltybt
        } else {
            // this._emailService.deliteEmail(this.currentFueld);
           const g = <FormArray>this.myForm.controls['groupForm'];
           this.umailsInfo.slice(this.currentIndex, 1);
           console.log(g.removeAt(this.currentIndex));
           this.searchNeddedField();
        }
        // removeAt(index: number)
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
    createNewField(email) {
        this.checkMail_PreSave(email);
        // if (this.validEmail(email)) {

        // }else {
        //     this.setErrorValid();
        // }
    }
    checkMail_PreSave(email: string) {
        this._emailService.getAllEmails(email).then(result => {
                const newFieldEmail = {
                    ISN_USER: this._userServices.curentUser['ISN_LCLASSIF'],
                    EMAIL: email,
                    IS_ACTIVE: 0,
                    WEIGHT: this._emailService.getMaxWeigth(),
                    EXCLUDE_OPERATION: ''
                };
                this.statusBtnSub = true;
                this.umailsInfo.push(newFieldEmail);
                this.addFormControls(newFieldEmail);
                this.currentIndex = this.umailsInfo.length - 1;
                this.modalRef.hide();
                // this._emailService.addMail(email).then( res => {
                //     this.umailsInfo.push(res);
                //     this.modalRef.hide();
                // });
            // } else {
            //     this.setErrorEmail();
            // }
        });
    }
    validEmail(email) {
        const regul = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
        const regexp = RegExp(regul).test(email);
        return regexp;
    }
    setErrorEmail() {
        if (this.defaultAlerts.size > 0) {
           if ( this.defaultAlerts.has('checkmail')) {
                    return;
           } else {
               this.defaultAlerts.set('checkmail',  {
                type: `checkmail`,
                msg: `Такая почта уже существует`
            });
           }
        }else {
            this.defaultAlerts.set('checkmail',  {
                type: `checkmail`,
                msg: `Такая почта уже существует`
            });
        }
        this.alerts = Array.from(this.defaultAlerts);
    }
    setErrorValid() {
        if (this.defaultAlerts.size > 0) {
            if ( this.defaultAlerts.has('validmail')) {
                     return;
            } else {
                this.defaultAlerts.set('validmail',  {
                 type: `validmail`,
                 msg: `Не правильный адрес почты`
             });
            }
         }else {
             this.defaultAlerts.set('validmail',  {
                 type: `validmail`,
                 msg: `Не правильный адресс почты`
             });
         }
         this.alerts = Array.from(this.defaultAlerts);
    }

    onClosed(type): void {
        this.defaultAlerts.delete(type);
        this.alerts = Array.from(this.defaultAlerts);
      }

      ngOnInit() {
        this.umailsInfo = this._userServices.curentUser['NTFY_USER_EMAIL_List'];
        this.createForm(false, false);
        this.myForm.valueChanges.subscribe(data => {
                this.checkChanges(data);
        });
      }
    //   ngDoCheck() {
    //       this.Sub.subscribe(data => {
    //         this.myForm.addControl(String(0), new FormGroup(this.createFormControls(data, false, false)));
    //         this.umailsInfo.push(data);
    //       });
    //   }

      createForm(bool1, bool2) {
        this.myForm = new FormGroup({'groupForm': this.createGroup(bool1, bool2)});
      }

      createGroup(bool1, bool2) {
          const arrayField =  this.umailsInfo;
          const group = new FormArray([]);
          arrayField.forEach(element => {
            group.push(new FormGroup(this.createFormControls(element, bool1, bool2)));
          });
          return group;
      }
      createFormControls(element, bool1, bool2) {
        const controls = {};
        controls['email'] = new FormControl(element.EMAIL);
        controls['checkbox'] = new FormControl(Number(element.IS_ACTIVE));
        controls['weigth'] = new FormControl(Number(element.WEIGHT));
        controls['params'] = new FormControl(element.EXCLUDE_OPERATION);
        controls['change'] = new FormControl(bool1);
        controls['newField'] = new FormControl(bool2);
        return controls;
      }
      checkChanges(data?) {
        let count_error = 0;
          if (data) {
              this.umailsInfo.forEach((element, index) => {
                const checkedField = data.groupForm[index];
                const checkedData = element;
                if (checkedField['email'] !== checkedData['EMAIL'] || Number(checkedField['checkbox']) !== Number(checkedData['IS_ACTIVE'])
                || checkedField['params'] !== checkedData['EXCLUDE_OPERATION'] || checkedField['newField'] === true ) {
                    this.statusBtnSub = false;
                    this.myForm.get('groupForm').get(String(index)).patchValue({change: true}, {emitEvent: false});
                    count_error++;
                }else {
                    this.statusBtnSub = true;
                    this.myForm.get('groupForm').get(String(index)).patchValue({change: false}, {emitEvent: false});
                }
              });
              count_error > 0 ? this.statusBtnSub = false : this.statusBtnSub = true;
              count_error = 0;
          }
      }
      addFormControls(newFieldEmail) {
        const control = <FormArray>this.myForm.controls['groupForm'];
        control.push(new FormGroup(this.createFormControls(newFieldEmail, false, true)));
      }
}
