import {AfterViewInit, Component, ElementRef, ViewChild, EventEmitter, Output, OnInit, Input} from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, SearchFormSettings } from 'eos-dictionaries/interfaces';

@Component({
    selector: 'eos-dictionary-quick-search',
    templateUrl: 'dictionary-quick-search.component.html',
})


export class DictionariesQuickSearchComponent implements AfterViewInit, OnInit {



    @Output() searchClose: EventEmitter<SearchFormSettings> = new EventEmitter();
    @Output() searchRun: EventEmitter<SearchFormSettings> = new EventEmitter();
    @Input() settings: SearchFormSettings;
    @ViewChild('quickSearchField') private searchElementRef: ElementRef;

    // private searchDone = true;

    get isTree(): boolean {
        return this._dictSrv.currentDictionary.descriptor.type !== E_DICT_TYPE.linear;
    }

    constructor(
        private _dictSrv: EosDictService,
        // private _msgSrv: EosMessageService,
        // private _storage: EosStorageService,
    ) { }

    public ngAfterViewInit(): void {
        this.searchElementRef.nativeElement.focus();
    }

    ngOnInit(): void {
        // this.srch = this._getStoredQSearch();
        // if (this.srch) {
        //     if (s.quickString) {
        //         this.srchString = s.;
        //     } else if (objSearch.quickForm) {
        //         this.openFastSrch();
        //     }
        // } else {

        // }
    }

    quickSearch(evt: KeyboardEvent) {
        if (evt.keyCode === 27) {
            this.closeQuickForm();
        }
        if (evt.keyCode === 13) {
            // if (this.searchDone) {
                this.searchRun.emit(this.settings);
                // this.srch.quickString = (this.srch.quickString) ? this.srch.quickString.trim() : '';
                // if (this.srch.quickString !== '') {
                //     this._dictSrv.setMarkAllNone();
                //     this.searchDone = false;
                //     this.settings.deleted = this._dictSrv.viewParameters.showDeleted;
                //     this._setStoredQSearch(this.srch);
                //     this._dictSrv.search(this.srch.quickString, this.settings)
                //         .then(() => this.searchDone = true);
                // }
            // } else {
            //     this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
            // }
        }
    }

    clearQuickForm() {
        this.settings.quick.data = '';
    }

    closeQuickForm () {
        this.searchClose.emit(this.settings);
    }

}
