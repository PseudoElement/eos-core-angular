import { Component, OnInit } from '@angular/core'; // ViewChild, HostListener
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
  // @ViewChild('full')  full;
  // @HostListener('document:click', ['$event.target'])
  //   onClick(event) {
  //       const clickedInside = this.full.popover.elementRef.nativeElement.contains(event)
  //       console.log(clickedInside);
  //       if (!clickedInside) {
  //           console.log("outside");
  //       }
  //   }
  users: USER_CL[] = [];
  selectEvents: any[] = [];
  data = {};
  bsConfig: Partial<BsDatepickerConfig>;
  placement = 'bottom';
  bsDate: Date;
  formBol: boolean = false;
  isOpenQuick = false;
  isShell: boolean = false;
  outsideClick: boolean = false;
  fields = CREATE_USER_INPUTS;
  inputs;
  usersAudit;
  ISN_USER;
  ISN_WHO;

  constructor(private _waitClassifSrv: WaitClassifService, private _inputCtrlSrv: InputParamControlService, private _pipeSrv: PipRX, public _apiSrv: UserParamApiSrv) {
    this.bsConfig = {
      showWeekNumbers: false,
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD.MM.YYYY',
      minDate: new Date('01/01/1900'),
      maxDate: new Date('12/31/2100'),
    };
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
      USER_PARMS: {
        criteries: {
          PARM_NAME: 'USER_EDIT_AUDIT'
        }
      }
    })
      .then(data => {
      });

    this._pipeSrv.read({
      USER_CL: {
        criteries: {
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

  selectUser() {
    OPEN_CLASSIF_USER_CL['criteriesName'] = this._apiSrv.configList.titleDue;
    this.isShell = true;
    this._waitClassifSrv.openClassif(OPEN_CLASSIF_USER_CL)
      .then(data => {
        this.data['ISN_USER_COPY'] = data;
        return this._getUserCl(data);
      })
      .then(data => {
        this.isShell = false;
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

  // onClick() {
  // console.log( this.insideElement);
  // const clickedInside = this.insideElement.nativeElement.contains(targetElement);
  // if (!clickedInside) {
  //   console.log('outside clicked');
  // }
  // }

}

