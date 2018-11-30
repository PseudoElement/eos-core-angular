import { Component, Injector } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-link-card',
    templateUrl: 'link-card.component.html',
    styleUrls: ['./link-card.component.scss']
})
export class LinkCardComponent extends BaseCardEditComponent {
    constructor(injector: Injector) {
        super(injector);
    }

    changeDir() {
        this.setValue('rec.LINK_DIR', Math.abs(this.direction - 1));
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
        return this.getValue('rec.PAIR_NAME');
    }
    get direction(): number {
        return this.getValue('rec.LINK_DIR');
    }
    get isNotLinksEqualsOrNew(): boolean {
        const isn = this.getValue('rec.ISN_LCLASSIF');
        const isn_pair = this.getValue('rec.ISN_PARE_LINK');
        return (isn === null) || !(isn === isn_pair);
    }
}
