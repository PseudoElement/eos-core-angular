import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {LimitedAccesseService} from '../../../shared/services/limited-access.service';
@Component({
    selector: 'eos-links-limited',
    styleUrls: ['links-limited.component.scss'],
    templateUrl: 'links-limited.component.html'
})
export class LinksLimitedComponent implements OnInit, OnDestroy {
    public myForm: UntypedFormGroup;
    public formArray: UntypedFormArray = new UntypedFormArray([]);
    public oldDate: Array<{[key: string]: string}>;
    public flagChande: boolean;
    Unsub = new Subject();
    @Output() changeLinks = new EventEmitter();
    constructor(
        private limitedServise: LimitedAccesseService,
    ) {
        this.flagChande = true;
        this.limitedServise.subscribe
        .pipe(
            takeUntil(this.Unsub)
        )
        .subscribe(data => {
               if (data) {
                   this.resetForm();
               } else {
               this.updateForm();
               }
        });
    }

    ngOnInit() {
        this.limitedServise.getResultArrayForLinks(this.limitedServise.user_id).then(info => {
            this.oldDate = info.slice();
            this.createArrayFormControll(info);
            this.createFrom();
            this.myForm.valueChanges
            .pipe(
                takeUntil(this.Unsub)
            )
            .subscribe(chenges => {
               this.checkChenges(chenges);
            });
        });
    }
    ngOnDestroy() {
        this.Unsub.next();
        this.Unsub.complete();
    }
    createFrom() {
        this.myForm = new UntypedFormGroup({'links':   this.formArray});
    }

    createArrayFormControll(array: Array<any>) {
        let dataFroInit = null;
        if (sessionStorage.getItem('links')) {
            dataFroInit = JSON.parse(sessionStorage.getItem('links'));
        } else {
            dataFroInit = array;
        }
        dataFroInit.forEach(elemForm => {
            const controls = {};
            controls['CLASSIF_NAME'] = new UntypedFormControl(elemForm['CLASSIF_NAME']);
            controls['ISN_LINK'] = new UntypedFormControl(elemForm['ISN_LINK']);
            controls['checkbox'] = new UntypedFormControl(elemForm.checkbox);
            controls['ACTION'] = new UntypedFormControl('UNSET');
            this.formArray.push(new UntypedFormGroup(controls));
        });
    }
    checkChenges(data) {
        let count_error = 0;
        const storage = [];
        this.oldDate.forEach( (element, index) => {
            const checkedField = data.links[index];
            const checkedData = element;
            storage.push(checkedField);
            if (checkedField.checkbox > checkedData.checkbox) {
                this.myForm.get('links').get(String(index))
                    .patchValue({'ACTION': 'CREATE'}, {emitEvent: false});
                    count_error++;
            } else if (checkedField.checkbox < checkedData.checkbox) {
                this.myForm.get('links').get(String(index))
                .patchValue({'ACTION': 'DELETE'}, {emitEvent: false});
                count_error++;
            } else {
                this.myForm.get('links').get(String(index))
                .patchValue({'ACTION': 'UNSET'}, {emitEvent: false});
            }
            if (count_error > 0) {
                this.flagChande = false;
            } else {
                this.flagChande = true;
        }
       sessionStorage.setItem('links', JSON.stringify(storage));
    });
       this.changeLinks.emit( {flag: this.flagChande, form: this.myForm});
    }
    resetForm() {
        const current = this.oldDate.slice();
        this.oldDate.splice(0,  this.oldDate.length);
        this.myForm.removeControl('links');
        this.formArray = new UntypedFormArray([]);
        sessionStorage.removeItem('links');
        this.oldDate = current;
        this.myForm.setControl('links', this.createGroup(current));
    }
    createGroup (date) {
        date.forEach(elemForm => {
            const controls = {};
            controls['CLASSIF_NAME'] = new UntypedFormControl(elemForm['CLASSIF_NAME']);
            controls['ISN_LINK'] = new UntypedFormControl(elemForm['ISN_LINK']);
            controls['checkbox'] = new UntypedFormControl(elemForm.checkbox);
            controls['ACTION'] = new UntypedFormControl('UNSET');
           this.formArray.push(new UntypedFormGroup(controls));
        });
        return this.formArray;
    }
    updateForm() {
        this.limitedServise.getResultArrayForLinks(this.limitedServise.user_id)
        .then(info => {
            sessionStorage.removeItem('links');
            this.oldDate.splice(0,  this.oldDate.length);
            this.myForm.removeControl('links');
            this.formArray = new UntypedFormArray([]);
            this.oldDate = info.slice();
            this.myForm.setControl('links', this.createGroup(info));
            this.oldDate = info.slice();
        });
    }
}
