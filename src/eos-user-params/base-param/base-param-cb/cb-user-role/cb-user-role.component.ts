import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
@Component({
    selector: 'eos-cb-user-role',
    templateUrl: 'cb-user-role.component.html',
    styleUrls: ['cb-user-role.component.scss'],
})
export class CbUserRoleComponent implements OnInit, OnDestroy {
    @Output() closeModal: EventEmitter<any> = new EventEmitter();
    basicFields: any[] = ['Председатель', 'Заместитель Председателя', 'Директор департамента и заместитель директора департамента', 'Помощник  Председателя',
    'Помощник заместителя предстедателя и директоров', 'Исполнитель'];
    currentFields: any[] = [];
    selectedBasicRole: any[];
    selectedCurrRole: any;
    private _subscriptionDrop: Subscription;
    private _subscriptionDrag: Subscription;
    constructor(private _dragulaService: DragulaService) {
    }

    ngOnInit() {
        this._subscriptionDrop = this._dragulaService.drop.subscribe((value) => {
            console.log(value);
        });
        this._subscriptionDrag = this._dragulaService.drag
            .subscribe((d) => {
                this.selectedBasicRole = null;
                this.selectedCurrRole = null;
            });
        this._dragulaService.setOptions('bag-one', {
            moves: (el/*, source, handle, sibling*/) => !el.classList.contains('bag-one')
        });
    }
    ngOnDestroy() {
        if (!!this._dragulaService.find('bag-one')) {
            this._dragulaService.destroy('bag-one');
        }
        this._subscriptionDrop.unsubscribe();
        this._subscriptionDrag.unsubscribe();
    }
    select(item, type: number) {
        switch (type) {
            case 1:
                this.selectedBasicRole = item;
                this.selectedCurrRole = null;
                break;
            case 2:
                this.selectedBasicRole = null;
                this.selectedCurrRole = item;
                break;
        }
    //    this.selectedRole = item;
    }
    onDrop() {

    }
}
