import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { USER_SEARCH } from '../../eos-user-select/shered/consts/search-const';
import { FormHelperService } from '../../eos-user-params/shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { FormGroup } from '@angular/forms';
@Component({
    selector: 'eos-user-search',
    templateUrl: './user-search.component.html',
    styleUrls: ['./user-search.component.scss'],
    providers: [FormHelperService]
})
export class UserSearchComponent implements OnInit {
    @Output() search = new EventEmitter<any>();
    private prapareData: any;
    private prepareInputs: any;
    private inputs: any;
    private form: FormGroup;
    constructor(
        private _formHelper: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
    ) {

    }

    ngOnInit() {
        this.pretInputs();

    }
    pretInputs() {
        this.prapareData = this._formHelper.parse_Create(USER_SEARCH.fields, {LOGIN: '', DEPARTMENT: '', DUE_DEP: '', CARD: ''});
        this.prepareInputs = this._formHelper.getObjectInputFields(USER_SEARCH.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prapareData });
        this.form = this.inpSrv.toFormGroup(this.inputs);
    }
    isActiveButton() {
    }
    startSearch() {
        const searchVal = this.form.value;
        const newObj = {};
        // if (this.form.controls['rec.CARD'].valid) {
        //     newObj['CARD'] = searchVal['rec.CARD'];
        // }
        if (this.form.controls['rec.DEPARTMENT'].valid) {
            newObj['DEPARTMENT'] = searchVal['rec.DEPARTMENT'];
        }
        if (this.form.controls['rec.DUE_DEP'].valid) {
            newObj['DUE_DEP'] = searchVal['rec.DUE_DEP'];
        }
        if (this.form.controls['rec.LOGIN'].valid) {
            newObj['LOGIN'] = searchVal['rec.LOGIN'];
        }
        this.search.emit(newObj);
    }

}
