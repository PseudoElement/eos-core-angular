import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { USER_SEARCH, USERSRCH, USERSRCHFORM } from '../../eos-user-select/shered/consts/search-const';
import { FormHelperService } from '../../eos-user-params/shared/services/form-helper.services';
import { EosDataConvertService } from '../../eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from '../../eos-common/services/input-control.service';
import { FormGroup } from '@angular/forms';
import { SearchServices } from '../shered/services/search.service';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { UserPaginationService } from '../../eos-user-params/shared/services/users-pagination.service';
import { WaitClassifService } from '../../app/services/waitClassif.service';
import { PipRX } from '../../eos-rest';

@Component({
    selector: 'eos-user-search',
    templateUrl: './user-search.component.html',
    styleUrls: ['./user-search.component.scss'],
    providers: [FormHelperService],
})

export class UserSearchComponent implements OnInit  {
    @Output() search = new EventEmitter<any>();
    @Output() quickSearchKey = new EventEmitter<any>();
    @ViewChild('full', { static: true }) fSearchPop;
    @ViewChild('quickSearchField') quickSearchField;
    @Input() quickSearchOpen;
    @Input() flagDeep;
    readonly fieldGroupsForSearch: string[] = ['Общий поиск', 'Поиск удаленных', 'Поиск по системам', 'Поиск по правам'];
    public srchString: string;
    public fastSearch: boolean = false;
    public fullSearch: boolean = false;
    public currTab: number = 0;
    public SEARCH_INCORRECT_SYMBOLS = new RegExp('["|\']', 'g');
    public inputs: any;
    public form: FormGroup;
    public disabledOrg = false;
    public disabledDep = false;
    private prapareData: any;
    private prepareInputs: any;
    private isnOrganization = '';
    private isnDepartment = '';
    private numberOrg: string[] = ['5', '6', '11', '12'];
    constructor(
        private _formHelper: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private srhSrv: SearchServices,
        private _storage: EosStorageService,
        private users_pagination: UserPaginationService,
        private _waitClassifSrv: WaitClassifService,
        private _pipSrv: PipRX,
    ) {
    }
    isActiveButton(): boolean {
        return (this.fullSearch || this.fSearchPop.isOpen);
    }
    isActiveButtonQuick() {
        const objSearch = this._getItemsSearchUsers();
        if (objSearch && objSearch.quickForm) {
            return true;
        }
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
        const objSearch = this._getItemsSearchUsers();
        this.fastSearch = false;
        if (objSearch) {
            this.currTab = objSearch.currTab;
            if (this.fSearchPop.isOpen === true && objSearch.fullForm) {
                this.form.patchValue(objSearch.fullForm);
            }
        } else {
            this.currTab = 0;
        }
    }

    get disableSearchBtn() {
        return true; // снимаем дизабл кнопки Найти @165429
        /*
        if (this.form) {
            return this.form.status === 'VALID' && (
                (this.form.controls['rec.DELO_RIGHTS'].value && this.form.controls['rec.DELO_RIGHTS'].value.trim().length) ||
                this.form.controls['rec.USERDEP_List'].value.trim().length ||
                this.form.controls['rec.USER_ORGANIZ_List'].value.trim().length ||
                this.form.controls['rec.LOGIN'].value.trim().length > 0 ||
                this.form.controls['rec.DEPARTMENT'].value.trim().length > 0 ||
                this.form.controls['rec.fullDueName'].value.trim().length > 0  ||
                this.form.controls['rec.SURNAME'].value.trim().length > 0 ||
                (this.form.controls['rec.BLOCK_USER'].value === '2' &&  this.currTab !== 3) ||
                this.currTab === 2
            );
        }
      */
    }

    get disableResetBtn() {
        if (this.form) {
            return this.form.controls['rec.LOGIN'].value.length > 0 ||
            this.form.controls['rec.DEPARTMENT'].value.length > 0 ||
            this.form.controls['rec.fullDueName'].value.length > 0  ||
            this.form.controls['rec.SURNAME'].value.length > 0 ||
            this.form.controls['rec.BLOCK_USER'].value === '1' ||
            this.form.controls['rec.BLOCK_USER'].value === '2' ||
            (this.form.controls['rec.DELO_RIGHTS'].value && this.form.controls['rec.DELO_RIGHTS'].value.trim().length) ||
            this.form.controls['rec.USERDEP_List'].value.trim().length ||
            this.form.controls['rec.USER_ORGANIZ_List'].value.trim().length ||
            this.currTab === 2;
        }
    }
    get disableDep(): boolean {
        return this.disabledDep || this.form.controls['rec.USER_ORGANIZ_List'].value;
    }
    get disableOrg(): boolean {
        return this.disabledOrg || this.form.controls['rec.USERDEP_List'].value;
    }
    ngOnInit() {
        const objSearch = this._getItemsSearchUsers();
        this.pretInputs();
        if (objSearch) {
            if (objSearch.fullForm) {
                this.fullSearch = true;
            } else if (objSearch.quickForm) {
                this.openFastSrch();
            }
        }
        this.form.controls['rec.1'].valueChanges
        .subscribe((value) => {
            if (!value) {
                this.form.controls['rec.DELO_WEB_RADIO'].patchValue('');
            } else {
                this.form.controls['rec.DELO_WEB_RADIO'].patchValue('competitive');
            }
        })
        this.srhSrv.closeSearch.subscribe(() => {
            this._storage.removeItem('searchUsers');
            this._storage.removeItem('quickSearch');
            this.resetForm(true);
        });
    }
    pretInputs() {
        this.prapareData = this._formHelper.parse_Create(USER_SEARCH.fields, { LOGIN: '', DEPARTMENT: '', DUE_DEP: '', BLOCK_USER: '0'});
        this.prepareInputs = this._formHelper.getObjectInputFields(USER_SEARCH.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prapareData });
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.form.controls['rec.USER_ORGANIZ_List'].disable();
        this.form.controls['rec.USERDEP_List'].disable();
        this.form.controls['rec.DELO_RIGHTS'].valueChanges
        .subscribe((value) => {
            if (value === '0' || !value) {
                /* this.disabledOrg = true;
                this.disabledDep = true;
                if (this.form.controls['rec.USER_ORGANIZ_List'].value) {
                    this.form.controls['rec.USER_ORGANIZ_List'].patchValue('');
                }
                if (this.form.controls['rec.USERDEP_List'].value) {
                    this.form.controls['rec.USERDEP_List'].patchValue('');
                } */
            } else {
                if (this.numberOrg.indexOf(value) === -1) {
                    this.disabledOrg = true;
                } else {
                    this.disabledOrg = false;
                }
                // this.disabledDep = false;
            }
        });
    }
    AddUnderscore(string: string): string {
        return string.replace(new RegExp('_', 'g'), '[' + '_' + ']');
    }
    clearField(field: string) {
        setTimeout(() => {
            this.form.controls[field].patchValue('');
        }, 0);
        this.isnOrganization = '';
        this.isnDepartment = '';
    }
    breakDUE(due: string): string[] {
        const returnDue = [];
        const arrDue: string[] = due.split('.');
        arrDue.pop();
        let str = '';
        arrDue.forEach((key) => {
            str = str + (key + '.');
            returnDue.push(str);
        });
        return returnDue;
    }
    openClassif(classif: string, disable: boolean) {
        if (disable) {
            return;
        }
        if (classif === 'CONTACT' && this.form.controls['rec.USERDEP_List'].value ) {
            return;
        }
        if (classif === 'DEPARTMENT' && this.form.controls['rec.USER_ORGANIZ_List'].value) {
            return;
        }
        this._waitClassifSrv.openClassif({
            classif: classif,
            selectLeafs: true,
            selectNodes: true,
            skipDeleted: false,
            selectMulty: true,
            return_due: true,
        }, true)
            .then((data: string) => {
                let query = {};
                if (classif === 'CONTACT') {
                    query = {
                        ORGANIZ_CL: {
                            criteries: {
                                DUE: data
                            }
                        }
                    };
                } else {
                    query = {
                        DEPARTMENT: {
                            criteries: {
                                DUE: data
                            }
                        }
                    };
                }
                this._pipSrv.read(query)
                .then((elemAll: any[]) => {
                    const field = [];
                    let DUE = [];
                    elemAll.forEach((elem) => {
                        field.push(elem['CLASSIF_NAME']);
                        DUE = [...DUE, ...this.breakDUE(elem['DUE'])];
                    });
                    DUE = DUE.filter(function (e, i, arr) {
                        return arr.lastIndexOf(e) === i;
                    });
                    if (classif === 'CONTACT') {
                        this.form.controls['rec.USER_ORGANIZ_List'].setValue(field.join('; '));
                        this.isnOrganization = DUE.join('|');
                    } else {
                        this.form.controls['rec.USERDEP_List'].setValue(field.join('; '));
                        this.isnDepartment = DUE.join('|');
                    }
                });
            })
            .catch((e) => {
                console.log('error', e);
            });
    }
    RemoveQuotes(newObj: any): void {
        for (const key in newObj) {
            if (newObj.hasOwnProperty(key) && key !== 'AV_SYSTEMS' && key !== 'BLOCK_USER' && key !== 'DELO_RIGHTS' && key !== 'USERDEP_List' && key !== 'USER_ORGANIZ_List') {
                const list = newObj[key];
                if (typeof list === 'string') {
                    newObj[key] = list.replace(this.SEARCH_INCORRECT_SYMBOLS, '');
                    this.form.controls[`rec.${key}`].patchValue(newObj[key]);
                    newObj[key] = this.AddUnderscore(newObj[key]);
                } else {
                    for (const k in list) {
                        if (list.hasOwnProperty(k)) {
                             let fixed = list[k].replace(this.SEARCH_INCORRECT_SYMBOLS, '');
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
        this._setItemsSearchUsers(this.form.value, null, this.currTab);
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
        if (this.form.controls['rec.DELO_RIGHTS'].value !== ''
            && this.form.controls['rec.USERDEP_List'].value === ''
            && this.form.controls['rec.USER_ORGANIZ_List'].value === '') {
            const deloR = '________________________________________';
            newObj['DELO_RIGHTS'] = this.SetAvSytemValue(deloR, +searchVal['rec.DELO_RIGHTS'] - 1, '1');
        }
        if (this.form.controls['rec.USERDEP_List'].value !== '') {
            newObj['USERDEP_List'] = this.isnDepartment;
            newObj['DELO_RIGHTS'] = searchVal['rec.DELO_RIGHTS'];
        }
        if (this.form.controls['rec.USER_ORGANIZ_List'].value !== '') {
            newObj['USER_ORGANIZ_List'] = this.isnOrganization;
            newObj['DELO_RIGHTS'] = searchVal['rec.DELO_RIGHTS'];
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
        let avSystemsStr = '__________________________________________';
        if (this.form.controls['rec.0'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 0, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 0, '_');
        }
        if (this.form.controls['rec.1'].value) {
            const index = this.form.controls['rec.DELO_WEB_RADIO'].value === 'competitive' ? 27 : 1;
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, index, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 1, '_');
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 27, '_');
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
        // if (this.form.controls['rec.21'].value) {
        //     avSystemsStr = this.SetAvSytemValue(avSystemsStr, 21, '1');
        // } else {
        //     avSystemsStr = this.SetAvSytemValue(avSystemsStr, 21, '_');
        // }
        // if (this.form.controls['rec.23'].value) {
        //     avSystemsStr = this.SetAvSytemValue(avSystemsStr, 23, '1');
        // } else {
        //     avSystemsStr = this.SetAvSytemValue(avSystemsStr, 23, '_');
        // }
        if (this.form.controls['rec.25'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 25, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 25, '_');
        }
        // if (this.form.controls['rec.26'].value) { // информера больне нет
        //     avSystemsStr = this.SetAvSytemValue(avSystemsStr, 26, '1');
        // } else {
        //     avSystemsStr = this.SetAvSytemValue(avSystemsStr, 26, '_');
        // }
        if (this.form.controls['rec.41'].value) {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 41, '1');
        } else {
            avSystemsStr = this.SetAvSytemValue(avSystemsStr, 41, '_');
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
        const objSearch = this._getItemsSearchUsers();
        this.fastSearch = !this.fastSearch;
        if (objSearch) {
            if (this.fastSearch === true && objSearch.quickForm) {
                this.srchString = objSearch.quickForm;
            }
        }
        if (this.fastSearch) {
            setTimeout(() => {
                if (this.quickSearchField) {
                    this.quickSearchField.nativeElement.focus();
                }
            }, 0);
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
                const strSearch = this.srchString.trim().replace(this.SEARCH_INCORRECT_SYMBOLS, '');
                if (strSearch) {
                    const queryF = this.srhSrv.getQueryForFilter({ SURNAME_PATRON: strSearch });
                    this.users_pagination.resetConfig();
                    this.quickSearchKey.emit(queryF);
                    this._setItemsSearchUsers(null, this.srchString, 0);
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
            this.clearQuickForm();
            this._setItemsSearchUsers(null, '', 0);
        }
        this.form.controls['rec.USER_ORGANIZ_List'].setValue('');
        this.form.controls['rec.USERDEP_List'].setValue('');
        this.isnOrganization = '';
        this.isnDepartment = '';
    }
    private _setItemsSearchUsers(full: any, quick: string, tab: number): void {
        const serchUsers: USERSRCHFORM = {fullForm: full, quickForm: quick, currTab: tab};
        this._storage.setItem('searchUsers', serchUsers);
    }

    private _getItemsSearchUsers(): USERSRCHFORM {
        return this._storage.getItem('searchUsers');
    }


}
