import {Input, Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription} from 'rxjs';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'eos-templates-card',
    templateUrl: './templates-card.component.html',
    styleUrls: ['./templates-card.component.scss']
})
export class TemplatesCardComponent implements OnInit, OnDestroy {
    @Input() form: FormGroup;
    @Input() inputs: any;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() isNewRecord: boolean;
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];
   public prevValues: any[];
   protected formChanges$: Subscription;
  // _ngUnsubscribe: Subject<any> = new Subject();

    constructor() {

    }
    getCardTitle (): any {
        return null;
    }

    ngOnInit() {
        console.log(this.form);
        console.log(this.inputs);
        console.log(this.data);
        console.log(this.isNewRecord);
        this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
    }
    ngOnDestroy() {

    }
    updateForm (newData) {
        console.log(newData);
    }
}
