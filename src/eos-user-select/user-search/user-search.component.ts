import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { USER_SEARCH, USERSRCH } from '../../eos-user-select/shered/consts/search-const';
import { FormHelperService } from '../../eos-user-params/shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { FormGroup } from '@angular/forms';
import { SearchServices } from '../shered/services/search.service';
import { EosStorageService } from 'app/services/eos-storage.service';
import { UserPaginationService } from 'eos-user-params/shared/services/users-pagination.service';

@Component({
    selector: 'eos-user-search',
    templateUrl: './user-search.component.html',
    styleUrls: ['./user-search.component.scss'],
    providers: [FormHelperService],
})

export class UserSearchComponent implements OnInit  {
    @Output() search = new EventEmitter<any>();
    @Output() quickSearchKey = new EventEmitter<any>();
    @ViewChild('full') fSearchPop;
    @Input() quickSearchOpen;
    @Input() flagDeep;
    readonly fieldGroupsForSearch: string[] = ['Общий поиск', 'Поиск удаленных', 'Поиск по системам'];
    public srchString: string;
    public fastSearch: boolean = false;
    public fullSearch: boolean = false;
    public currTab: number = 0;
    private prapareData: any;
    private prepareInputs: any;
    private inputs: any;
    private form: FormGroup;
    private _submitFullFormValue: any;
    private _submitQuickFormValue: string;
    constructor(
        private _formHelper: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private srhSrv: SearchServices,
        private _storage: EosStorageService,
        private users_pagination: UserPaginationService,
    ) {
    }
    isActiveButton(): boolean {
        return (this.fullSearch || this.fSearchPop.isOpen);
    }
    isActiveButtonQuick() {
        return (this.fastSearch);
    }
    closeFastSrch() {
        this.fastSearch = false;
    }

    setTab(i: number) {
        this.currTab = i;
        this.resetForm();
    }
    onShown() {
        const fullSearch = this._storage.getItem('fullForm');
        this.currTab = this._storage.getItem('currTab');
        if (!this.currTab) {
            this.currTab = 0;
        }
        if (this.fSearchPop.isOpen === true && fullSearch) {
            this.form.patchValue(fullSearch);
        }
    }

    get disableBtn() {
        if (this.form) {
            return this.form.status === 'VALID' && (this.form.controls['rec.LOGIN'].value.trim().length > 0 || this.form.controls['rec.DEPARTMENT'].value.trim().length > 0 ||
            this.form.controls['rec.fullDueName'].value.trim().length > 0  || this.form.controls['rec.SURNAME'].value.trim().length > 0 ||
                this.form.controls['rec.BLOCK_USER'].value === '2' || this.currTab === 2);
        }
    }
    ngOnInit() {
        this.pretInputs();
        this._submitFullFormValue = this._storage.getItem('fullForm');
        this._submitQuickFormValue = this._storage.getItem('quickForm');
        if (this._submitFullFormValue) {
            this.fullSearch = true;
        } else if (this._submitQuickFormValue) {
            this.openFastSrch();
        }
    }
    pretInputs() {
        this.prapareData = this._formHelper.parse_Create(USER_SEARCH.fields, { LOGIN: '', DEPARTMENT: '', DUE_DEP: '', BLOCK_USER: '0'});
        this.prepareInputs = this._formHelper.getObjectInputFields(USER_SEARCH.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prapareData });
        this.form = this.inpSrv.toFormGroup(this.inputs);
    }
    AddUnderscore(string: string): string {
        return string.replace(new RegExp('_', 'g'), '[' + '_' + ']');
    }

    RemoveQuotes(newObj: any): void {
       const SEARCH_INCORRECT_SYMBOLS = new RegExp('["|\']', 'g');
        for (const key in newObj) {
            if (newObj.hasOwnProperty(key) && key !== 'AV_SYSTEMS' && key !== 'BLOCK_USER') {
                const list = newObj[key];
                if (typeof list === 'string') {
                    newObj[key] = list.replace(SEARCH_INCORRECT_SYMBOLS, '');
                    this.form.controls[`rec.${key}`].patchValue(newObj[key]);
                    newObj[key] = this.AddUnderscore(newObj[key]);
                } else {
                    for (const k in list) {
                        if (list.hasOwnProperty(k)) {
                             let fixed = list[k].replace(SEARCH_INCORRECT_SYMBOLS, '');
                             list[k] = fixed;
                            this.form.controls[`rec.${key}`].patchValue(newObj[key]);
                            fixed = this.AddUnderscore(fixed);
                        }
                    }
                }
            }
        }
    }

    startSearch() {
        const newObj: USERSRCH = {};
        this.setConfSearch(newObj);
        if (newObj.CARD) {
            delete newObj.DEPARTMENT;
        }
        if (newObj.DEPARTMENT) {
            delete newObj.CARD;
        }
        this.RemoveQuotes(newObj);
        const queryF = this.srhSrv.getQueryForFilter(newObj, this.currTab);
        this._storage.setItem('fullForm', this.form.value);
        this._storage.setItem('quickForm', null);
        this._storage.setItem('currTab', this.currTab);
        this.users_pagination.resetConfig();
        this.search.emit(queryF);
        this.clearQuickForm();
        this.fullSearch = true;
        this.fSearchPop.isOpen = false;
    }
    setConfSearch(newObj) {
        const searchVal = this.form.value;
        if (this.form.controls['rec.CARD'].valid && this.form.controls['rec.CARD'].value !== '') {
            newObj['CARD'] = searchVal['rec.CARD'].trim();
        }
        if (this.form.controls['rec.DEPARTMENT'].valid && this.form.controls['rec.DEPARTMENT'].value !== '') {
            newObj['DEPARTMENT'] = searchVal['rec.DEPARTMENT'].trim();

        }
        if (this.form.controls['rec.fullDueName'].valid && this.form.controls['rec.fullDueName'].value !== '') {
            newObj['fullDueName'] = searchVal['rec.fullDueName'].trim();
        }
        if (this.form.controls['rec.LOGIN'].valid && this.form.controls['rec.LOGIN'].value !== '') {
            newObj['LOGIN'] = searchVal['rec.LOGIN'].trim();
        }
        if (this.form.controls['rec.SURNAME'].valid && this.form.controls['rec.SURNAME'].value !== '') {
            newObj['SURNAME'] = searchVal['rec.SURNAME'].trim();
        }

        newObj['AV_SYSTEMS'] = this.GetStrAvSystems();

        switch (searchVal['rec.BLOCK_USER']) {
            case '1':
                newObj['BLOCK_USER'] = '0';
                break;
            case '2':
                newObj['BLOCK_USER'] = '1';
                break;
        }
    }

    GetStrAvSystems(): string {
        let avSystemsStr = '___________________________';
        if (this.form.controls['rec.0'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 0, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 0, '_');
        }
        if (this.form.controls['rec.1'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 1, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 1, '_');
        }
        if (this.form.controls['rec.2'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 2, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 2, '_');
        }
        if (this.form.controls['rec.3'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 3, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 3, '_');
        }
        if (this.form.controls['rec.5'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 5, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 5, '_');
        }
        if (this.form.controls['rec.15'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 15, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 15, '_');
        }
        if (this.form.controls['rec.16'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 16, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 16, '_');
        }
        if (this.form.controls['rec.17'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 17, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 17, '_');
        }
        if (this.form.controls['rec.21'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 21, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 21, '_');
        }
        if (this.form.controls['rec.23'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 23, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 23, '_');
        }
        if (this.form.controls['rec.25'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 25, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 25, '_');
        }
        if (this.form.controls['rec.26'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 26, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 26, '_');
        }
        if (avSystemsStr.indexOf('1') === -1) {
            avSystemsStr = '0000_0_________000___0_0_00';
        }
        return avSystemsStr;
    }

    SetAvSytemValue(str: string, index: number, val: string): string {
        return str.substr(0, index) + val + str.substr(index + val.length);
    }
    openFastSrch() {
        const quickForm = this._storage.getItem('quickForm');
        this.fastSearch = !this.fastSearch;
        if (this.fastSearch === true && quickForm) {
            this.srchString = quickForm;
        }
    }
    clickKey($event) {
        if ($event.keyCode === 27) {
            this.clearQuickForm();
        }
        if ($event.keyCode === 13) {
            if (this.srchString) {
                this.fullSearch = false;
                this.fastSearch = true;
                const strSearch = this.srchString.trim();
                if (strSearch) {
                    const queryF = this.srhSrv.getQueryForFilter({ LOGIN: strSearch });
                    this.users_pagination.resetConfig();
                    this.quickSearchKey.emit(queryF);
                    this._storage.setItem('fullForm', null);
                    this._storage.setItem('quickForm', this.srchString);
                    this._storage.setItem('currTab', 0);
                    this.resetForm();
                }
            }
        }
    }
    clearQuickForm() {
        this.fastSearch = false;
        this.srchString = '';
    }

    resetForm(flag?: boolean) {
        Object.keys(this.form.value).forEach(key => {
            if (key === 'rec.BLOCK_USER') {
                this.form.controls[key].patchValue('0');
            } else {
                this.form.controls[key].patchValue('');
            }
        });
        if (flag) {
            this.fullSearch = false;
            this._storage.setItem('fullForm', null);
            this._storage.setItem('quickForm', '');
            this._storage.setItem('currTab', 0);
        }
    }

}
