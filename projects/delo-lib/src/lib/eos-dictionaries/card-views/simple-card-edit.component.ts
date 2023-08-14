import { Component, Injector } from '@angular/core';

import { BaseCardEditDirective } from './base-card-edit.component';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

@Component({
    selector: 'eos-simple-card-edit',
    templateUrl: 'simple-card-edit.component.html',
})

export class SimpleCardEditComponent extends BaseCardEditDirective {

    get styleModeEdit() {
        if (this.dictSrv.currentDictionary && this.dictSrv.currentDictionary.id === E_DICTIONARY_ID.CA_CATEGORY_CL && this.editMode && !this.isNewRecord) {
            return { 'height': 'calc(100vh - 225px)' };
        }
        return '';
    }
    constructor(injector: Injector) {
        super(injector);
    }
}
