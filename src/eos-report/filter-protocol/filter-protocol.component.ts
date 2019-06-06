import { Component, OnInit, ViewChild, HostListener } from '@angular/core'; // ViewChild, HostListener
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { OPEN_CLASSIF_USER_CL, CREATE_USER_INPUTS } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { USER_CL, PipRX } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';


@Component({
  selector: 'eos-filter-protocol',
  templateUrl: './filter-protocol.component.html',
  styleUrls: ['./filter-protocol.component.scss']
})

export class EosReportSummaryFilterProtocolComponent implements OnInit {
  @ViewChild('full') full;
  data = {};
  bsConfig: Partial<BsDatepickerConfig>;
  placement = 'bottom';
  bsDateFrom: Date;
  bsDateBefore: Date;
  isOpen = false;
  formBol: boolean = false;
  isShell: boolean = false;
  fields = CREATE_USER_INPUTS;
  inputs;
  valueEdit = [];
  valueWho = [];
  eventKind = [
    { value: '' },
    { value: 'Блокирование Пользователя' },
    { value: 'Разблокирование Пользователя' },
    { value: 'Создание пользователя' },
    { value: 'Редактирование пользователя БД' },
    { value: 'Редактирование прав ДЕЛА' },
    { value: 'Редактирование прав поточного сканирования' },
    { value: 'Удаление Пользователя' }
  ];

  constructor(private _waitClassifSrv: WaitClassifService, private _inputCtrlSrv: InputParamControlService, private _pipeSrv: PipRX, public _apiSrv: UserParamApiSrv) {
    this.bsConfig = {
      showWeekNumbers: false,
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD.MM.YYYY',
      minDate: new Date('01/01/1900'),
      maxDate: new Date('12/31/2100'),
    };
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
    this._pipeSrv.read({
      USER_PARMS: {
        criteries: {
          ISN_USER_OWNER: '-99',
          PARM_NAME: 'CATEGORIES_FOR_USER|USER_EDIT_AUDIT'
        }
      }
    })
      .then(data => {
      });

    this._pipeSrv.read({
      USER_AUDIT: {
        criteries: {
        }
      }
    })
      .then(data => {
      });
  }

  isActiveButton(): boolean {
    this.formBol = !this.formBol;
    return this.formBol;
  }

  buttonChanged(e: Event) {
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
        data.map((user) => {
          this.valueEdit.push(user.SURNAME_PATRON);
        });
        return this.valueEdit;
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
        data.map((user) => {
          this.valueWho.push(user.SURNAME_PATRON);
        });
        return this.valueWho.toString();
      })
      .catch(() => {
        this.isShell = false;
      });

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

