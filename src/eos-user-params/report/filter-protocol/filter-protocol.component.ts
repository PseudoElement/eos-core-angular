import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { OPEN_CLASSIF_USER_CL, CREATE_USER_INPUTS } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { USER_CL, PipRX } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { FormGroup } from '@angular/forms';
import { FormHelperService } from 'eos-user-params/shared/services/form-helper.services';
import { FILTER_PROTOCOL } from 'eos-user-params/user-params-set/shared-user-param/consts/filter-users.const';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';

@Component({
  selector: 'eos-filter-protocol',
  templateUrl: './filter-protocol.component.html',
  styleUrls: ['./filter-protocol.component.scss'],
  providers: [FormHelperService]
})

export class EosReportSummaryFilterProtocolComponent implements OnInit {
  @ViewChild('full') full;
  data = {};
  placement = 'bottom';
  public prepareData;
  public prepareInputs;
  public allData;
  formBol: boolean = false;
  isShell: boolean = false;
  filterBtn: boolean = false;
  fields = CREATE_USER_INPUTS;
  filterForm: FormGroup;
  inputs;
  searchModel = {};
  @Output() filterProtocol: EventEmitter<any> = new EventEmitter();

  constructor(
    private _waitClassifSrv: WaitClassifService, private _inputCtrlSrv: InputParamControlService,
    private _pipeSrv: PipRX, public _apiSrv: UserParamApiSrv, private inpSrv: InputControlService,
    private formHelp: FormHelperService, private dataConv: EosDataConvertService
  ) {
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    setTimeout(() => {
      if (this.full.isOpen === false) {
        this.formBol = false;
      }
    }, 0);
  }

  ngOnInit() {
    this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
    this.init();
  }

  init() {
    this.pretInputs();
    this.filterForm = this.inpSrv.toFormGroup(this.inputs);
  }
  get disableBtn() {
      return Object.keys(this.filterForm.value).findIndex((prop) => this.filterForm.value[prop] ) === -1;
  }

  pretInputs(): void {
    this.allData = {
      DATEFROM: '',
      DATETO: '',
      USEREVENTS: '',
      USEREDIT: '',
      USERWHO: '',
      USEREDITISN: '',
      USERWHOISN: '',
    };
    this.prepareData = this.formHelp.parse_Create(FILTER_PROTOCOL.fields, this.allData);
    this.prepareInputs = this.formHelp.getObjectInputFields(FILTER_PROTOCOL.fields);
    this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
  }

  isActiveButton(): boolean {
    this.formBol = !this.formBol;
    return this.formBol;
  }

  selectUserEdit() {
    OPEN_CLASSIF_USER_CL['criteriesName'] = this._apiSrv.configList.titleDue;
    OPEN_CLASSIF_USER_CL['selectMulty'] = true;
    this.isShell = true;
    this._waitClassifSrv.openClassif(OPEN_CLASSIF_USER_CL)
      .then(data => {
        this.data['ISN_USER_COPY'] = data;
        return this._getUserCl(data);
      })
      .then(data => {
        this.isShell = false;
        const valueEdit = [];
        data.map((user) => {
          valueEdit.push(user.SURNAME_PATRON, user.ISN_LCLASSIF);
        });
        this.allData.USEREDIT = valueEdit[0].toString();
        this.allData.USEREDITISN = valueEdit[1].toString();
        this.filterForm.controls['rec.USEREDITISN'].patchValue(this.allData.USEREDITISN);
        this.filterForm.controls['rec.USEREDIT'].patchValue(this.allData.USEREDIT);
      })
      .catch(() => {
        this.isShell = false;
      });

  }

  selectUserWho() {
    OPEN_CLASSIF_USER_CL['criteriesName'] = this._apiSrv.configList.titleDue;
    OPEN_CLASSIF_USER_CL['selectMulty'] = true;
    this.isShell = true;
    this._waitClassifSrv.openClassif(OPEN_CLASSIF_USER_CL)
      .then(data => {
        this.data['ISN_USER_COPY'] = data;
        return this._getUserCl(data);
      })
      .then(data => {
        this.isShell = false;
        const valueWho = [];
        data.map((user) => {
          valueWho.push(user.SURNAME_PATRON, user.ISN_LCLASSIF);
        });
        this.allData.USERWHO = valueWho[0].toString();
        this.allData.USERWHOISN = valueWho[1].toString();
        this.filterForm.controls['rec.USERWHOISN'].patchValue(this.allData.USERWHOISN);
        this.filterForm.controls['rec.USERWHO'].patchValue(this.allData.USERWHO);
      })
      .catch(() => {
        this.isShell = false;
      });

  }

  ClearForm() {
    this.filterForm.controls['rec.DATEFROM'].patchValue('0');
    this.filterForm.controls['rec.DATETO'].patchValue('0');
    this.filterForm.reset();
  }

  FilterUsers() {
    this.filterProtocol.emit(this.filterForm.value);
    this.full.isOpen = false;
  }

  private _getUserCl(isn) {
    const queryUser = {
      USER_CL: {
        criteries: {
          ISN_LCLASSIF: isn
        }
      }
    };
    return this._pipeSrv.read<USER_CL>(queryUser);
  }
}