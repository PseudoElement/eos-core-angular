import {Component, Injector, OnChanges, SimpleChanges} from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-link-card',
    templateUrl: 'link-card.component.html',
    styleUrls: ['./link-card.component.scss']
})
export class LinkCardComponent extends BaseCardEditComponent implements OnChanges {
    constructor(injector: Injector) {
        super(injector);
    }

    changeDir() {
        const link_dir = this.direction;
        this.setValue('rec.LINK_DIR', Math.abs( link_dir - 1));
        this.setValue('PARE_LINK_Ref.LINK_DIR', link_dir);
    }
    get linkType(): number {
        return this.getValue('rec.LINK_TYPE');
    }
    get isLinkTypeNull(): boolean {
        return this.linkType == null;
    }
    get classifName(): string {
        return this.getValue('rec.CLASSIF_NAME');
    }
    get pairName(): string {
        return this.getValue('PARE_LINK_Ref.CLASSIF_NAME');
    }
    get direction(): number {
        return this.getValue('rec.LINK_DIR');
    }
    get isNotLinksEqualsOrNew(): boolean {
        const isn = this.getValue('rec.ISN_LCLASSIF');
        const isn_pair = this.getValue('rec.ISN_PARE_LINK');
        return (isn === null) || !(isn === isn_pair);
    }

    get leftDirectionTitle(): string {
        let title = '';
        switch (String(this.linkType)) {
            case String(1):
                title = 'Первичный документ';
                break;
            case String(2):
                title = 'Инициативный документ';
                break;
            case String(3):
                title = 'Проект документа';
                break;
        }
        return title;
    }

    get rightDirectionTitle(): string {
        let title = '';
        switch (String(this.linkType)) {
            case String(1):
                title = 'Повторный документ';
                break;
            case String(2):
                title = 'Проект документа';
                break;
            case String(3):
                title = 'Утвержденный документ';
                break;
        }
        return title;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.form) {
            this.unsubscribe();
            this._subscribeOnChanges();
        }
    }

    private _subscribeOnChanges() {
        this.formChanges$ = this.form.valueChanges.subscribe((fc) => this._updateForm(fc));
    }

    private _updateForm(formChanges: any) {
        this.unsubscribe();

        if (!formChanges['rec.LINK_TYPE'] || formChanges['rec.LINK_TYPE'] === '0') {
            this.setValue('rec.LINK_TYPE', null);
            this.setValue('rec.LINK_DIR', null);
            this.setValue('PARE_LINK_Ref.LINK_TYPE', null);
            this.setValue('PARE_LINK_Ref.LINK_DIR', null);
        } else {
            this.setValue('PARE_LINK_Ref.LINK_TYPE', formChanges['rec.LINK_TYPE']);
            if (this.getValue('rec.LINK_DIR') === null) {
                this.setValue('rec.LINK_DIR', 0);
                this.setValue('PARE_LINK_Ref.LINK_DIR', 1);
            }
        }

        this._subscribeOnChanges();
    }
}
