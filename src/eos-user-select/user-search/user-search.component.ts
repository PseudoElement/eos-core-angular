import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { USER_SEARCH } from '../../eos-user-select/shered/consts/search-const';
import { FormHelperService } from '../../eos-user-params/shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { FormGroup } from '@angular/forms';
import {SearchServices} from '../shered/services/search.service';
@Component({
    selector: 'eos-user-search',
    templateUrl: './user-search.component.html',
    styleUrls: ['./user-search.component.scss'],
    providers: [FormHelperService]
})
export class UserSearchComponent implements OnInit {
    @Output() search = new EventEmitter<any>();
    @ViewChild('full') bs_fail: any;
    @Input() flagDeep;
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
    //  isActiveButton() {

    // }

    disableBtn() {
             if (this.form) {
            return this.form.value['rec.LOGIN'].length > 0
                || (this.form.value['rec.DEPARTMENT'].length > 0 && this.form.controls['rec.DEPARTMENT'].valid)
                || (this.form.value['rec.fullDueName'].length > 0 && this.form.controls['rec.fullDueName'].valid);
        } else {
            return true;
        }
    }
    ngOnInit() {
        this.pretInputs();

    }
    pretInputs() {
        this.prapareData = this._formHelper.parse_Create(USER_SEARCH.fields, { LOGIN: '', DEPARTMENT: '', DUE_DEP: '', CARD: '' });
        this.prepareInputs = this._formHelper.getObjectInputFields(USER_SEARCH.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prapareData });
        this.form = this.inpSrv.toFormGroup(this.inputs);
    }
    startSearch() {
        const searchVal = this.form.value;
        this.srhSrv.getSearchCard(searchVal['rec.CARD']);
        this.srhSrv.getSearchDepartment(searchVal['rec.fullDueName']);
         const newObj = {};
        if (this.form.controls['rec.CARD'].valid && this.form.controls['rec.CARD'].value !== '') {
            newObj['CARD'] = searchVal['rec.CARD'];
        }
        // if (this.form.controls['rec.DEPARTMENT'].valid && this.form.controls['rec.DEPARTMENT'].value !== '') {
        //     newObj['DEPARTMENT'] = searchVal['rec.DEPARTMENT'];
        // }
        if (this.form.controls['rec.fullDueName'].valid && this.form.controls['rec.fullDueName'].value !== '') {
            newObj['fullDueName'] = searchVal['rec.fullDueName'];
        }
        // if (this.form.controls['rec.LOGIN'].valid && this.form.controls['rec.LOGIN'].value !== '') {
        //     newObj['LOGIN'] = searchVal['rec.LOGIN'];
        // }
        // newObj['TEH'] = searchVal['rec.TEH'];
        // newObj['DEL_USER'] = searchVal['rec.DEL_USER'];
        // this.bs_fail.isOpen = false;
        this.srhSrv.searchPrepareCardAndFullDue(newObj);
      //   this.search.emit(null);
    }
    resetForm() {
        this.form.controls['rec.DEPARTMENT'].patchValue('');
        this.form.controls['rec.CARD'].patchValue('');
        this.form.controls['rec.fullDueName'].patchValue('');
        this.form.controls['rec.LOGIN'].patchValue('');
        this.form.controls['rec.TEH'].patchValue(false);
        this.form.controls['rec.DEL_USER'].patchValue(false);
    }

}
