import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { USER_SEARCH, USERSRCH } from '../../eos-user-select/shered/consts/search-const';
import { FormHelperService } from '../../eos-user-params/shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { FormGroup } from '@angular/forms';
import { SearchServices } from '../shered/services/search.service';

@Component({
    selector: 'eos-user-search',
    templateUrl: './user-search.component.html',
    styleUrls: ['./user-search.component.scss'],
    providers: [FormHelperService],
})

export class UserSearchComponent implements OnInit {
    @Output() search = new EventEmitter<any>();
    @Output() quickSearchKey = new EventEmitter<any>();
    @ViewChild('full') fSearchPop;
    @Input() quickSearchOpen;
    @Input() flagDeep;
    public srchString: string;
    public fastSearch: boolean = false;
    private prapareData: any;
    private prepareInputs: any;
    private inputs: any;
    private form: FormGroup;
    constructor(
        private _formHelper: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private srhSrv: SearchServices,
    ) {
    }
    isActiveButton(): boolean {
        return (this.fSearchPop.isOpen);
    }
    isActiveButtonQuick() {
        return (this.fastSearch);
    }
    closeFastSrch() {
        this.fastSearch = false;
    }

    get disableBtn() {
        if (this.form) {
            return this.form.status === 'VALID' && (this.form.value['rec.LOGIN'].length > 0 || this.form.value['rec.DEPARTMENT'].length > 0 ||
                this.form.value['rec.fullDueName'].length > 0  || this.form.value['rec.SURNAME'].length > 0);
        }
    }
    get showSurnameField() {
        return this.form.controls['rec.DEL_USER'].value;
    }
    ngOnInit() {
        this.pretInputs();
    }
    pretInputs() {
        this.prapareData = this._formHelper.parse_Create(USER_SEARCH.fields, { LOGIN: '', DEPARTMENT: '', DUE_DEP: '' });
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
            if (newObj.hasOwnProperty(key)) {
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
        const queryF = this.srhSrv.getQueryForFilter(newObj);
        this.search.emit(queryF);
        // this.srhSrv._pipApisrv.read(queryF).then(data => {
        //     console.log(data);
        // }).catch(error => {
        //     console.log(error);
        // })

        // if (newObj['SURNAME']) {
        //     this.srhSrv.getUsersToGo(newObj).then(users => {
        //         this.search.emit(users);
        //     });
        // } else {
        //     if (this.flagDeep) {
        //         this.withCard(newObj);
        //     } else {
        //         this.withOutCard(newObj);
        //     }
        // }

        this.fSearchPop.isOpen = false;
        //   this.search.emit(null);
    }
    setConfSearch(newObj) {
        const searchVal = this.form.value;
        if (this.form.controls['rec.CARD'].valid && this.form.controls['rec.CARD'].value !== '') {
            newObj['CARD'] = searchVal['rec.CARD'].replace(/\s/g, '_').trim();
        }
        if (this.form.controls['rec.DEPARTMENT'].valid && this.form.controls['rec.DEPARTMENT'].value !== '') {
            newObj['DEPARTMENT'] = searchVal['rec.DEPARTMENT'].replace(/\s/g, '_').trim();

        }
        if (this.form.controls['rec.fullDueName'].valid && this.form.controls['rec.fullDueName'].value !== '') {
            newObj['fullDueName'] = searchVal['rec.fullDueName'].replace(/\s/g, '_').trim();
        }
        if (this.form.controls['rec.LOGIN'].valid && this.form.controls['rec.LOGIN'].value !== '') {
            newObj['LOGIN'] = searchVal['rec.LOGIN'].replace(/\s/g, '_').trim();
        }
        if (this.form.controls['rec.SURNAME'].valid && this.form.controls['rec.SURNAME'].value !== '') {
            newObj['SURNAME'] = searchVal['rec.SURNAME'].replace(/\s/g, '_').trim();
        }
        newObj['DEL_USER'] = searchVal['rec.DEL_USER'];
    }
    // withCard(config: USERSRCH) {
    //     if (config.CARD && config.fullDueName) {
    //         this.srhSrv.searchPrepareCardAndFullDue(config, true).then((users: USER_CL[] | boolean) => {
    //             this.search.emit(users);
    //         });
    //     } else if (config.fullDueName) {
    //         this.srhSrv.searchCardOneParam(config).then((users: USER_CL[] | boolean) => {
    //             this.search.emit(users);
    //         });
    //     } else if (config.CARD) {
    //         this.srhSrv.searchCardOneCardParam(config, true).then((users: USER_CL[] | boolean) => {
    //             this.search.emit(users);
    //         });
    //     } else if (config.LOGIN) {
    //         this.srhSrv.getUsersToGo(config).then((users: USER_CL[]) => {
    //             this.search.emit(users);
    //         });
    //     }
    // }
    // withOutCard(config: USERSRCH) {
    //     if (config.fullDueName && config.DEPARTMENT) {
    //         this.srhSrv.searchPrepareCardAndFullDue(config, false).then((users: USER_CL[] | boolean) => {
    //             this.search.emit(users);
    //         });
    //     } else if (config.DEPARTMENT) {
    //         this.srhSrv.searchCardOneCardParam(config, false).then((users: USER_CL[]) => {
    //             this.search.emit(users);
    //         });
    //     } else if (config.fullDueName) {
    //         this.srhSrv.searchCardOneParam(config).then((users: USER_CL[] | boolean) => {
    //             this.search.emit(users);
    //         });
    //     } else if (config.LOGIN) {
    //         this.srhSrv.getUsersToGo(config).then((users: USER_CL[]) => {
    //             this.search.emit(users);
    //         });
    //     }
    // }
    openFastSrch() {
        this.fastSearch = !this.fastSearch;
    }
    clickKey($event) {
        if ($event.keyCode === 27) {
            this.clearQuickForm();
        }
        if ($event.keyCode === 13) {
            if (this.srchString) {
                const strSearch = this.srchString.trim();
                this.srchString = this.srchString.trim();
                this.srchString = this.srchString.replace(/\s/g, '_').trim();
                if (strSearch) {
                    const queryF = this.srhSrv.getQueryForFilter({ LOGIN: strSearch });
                    this.quickSearchKey.emit(queryF);
                }
            }
        }
    }
    clearQuickForm() {
        this.fastSearch = false;
        this.srchString = '';
    }

    resetForm() {
        this.form.controls['rec.DEPARTMENT'].patchValue('');
        this.form.controls['rec.CARD'].patchValue('');
        this.form.controls['rec.fullDueName'].patchValue('');
        this.form.controls['rec.LOGIN'].patchValue('');
        this.form.controls['rec.SURNAME'].patchValue('');
        // this.form.controls['rec.DEL_USER'].patchValue(false);
    }

}
