import { Component, OnInit } from '@angular/core';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';
import { PipRX, USER_CL, USER_PARMS } from 'eos-rest';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';

@Component({
  selector: 'eos-report-stats',
  templateUrl: './users-stats.component.html',
  styleUrls: ['./users-stats.component.scss']
})
export class EosReportUsersStatsComponent implements OnInit {
  subsystem: any;
  items: USER_CL[] = [];
  blockByTech: number = 0;
  blockAuthUsers: number = 0;
  usersNumber: number = 0;
  paramValue: number;
  logUsers: string;
  subSysArray = [];
  protUsers;
  deletedUsers;

  delo: number = 0; delowebLGO: number = 0; delowebKL: number = 0;
  Shif: number = 0; SCAN: number = 0; Pscan: number = 0; Scan_code: number = 0;
  Search_code: number = 0; Notifer: number = 0; Informer: number = 0;
  EOS: number = 0; MobNet: number = 0; APM: number = 0;

  constructor(private _selectedUser: RtUserSelectService, private pip: PipRX, private _errorSrv: ErrorHelperServices, ) {
    this.subsystem = this._selectedUser.ArraySystemHelper;
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    const a = this.pip.read<USER_CL>({
      USER_CL: PipRX.criteries({ 'DELETED': '0', 'PROTECTED': '0' })
    }).then((r: any) => {
      this.items = r;
    })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
    const b = this.pip.read<USER_PARMS>({
      USER_PARMS: PipRX.criteries({ 'PARM_NAME': 'MAX_LOGIN_ATTEMPTS|USER_EDIT_AUDIT' })
    }).then((r: any) => {
      if (r[1].PARM_VALUE === 'NO') {
        this.logUsers = 'Не выполнено';
      } else {
        this.logUsers = 'Выполнено';
      }
      this.paramValue = parseInt(r[0].PARM_VALUE, 10);
    })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });

    const c = this.pip.read<USER_CL>({
      USER_CL: PipRX.criteries({ 'DELETED': '1' })
    })
      .then((r: any) => {
        this.deletedUsers = r;
      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
    Promise.all([a, b, c]).then(() => {
      this.getSubSystems(this.items);
      this.getProtectedUsers(this.deletedUsers);
      this.usersNumber = this.usersNumber + this.items.length;
    }
    )
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      })
      ;
  }


  getProtectedUsers(data) {
    for (const i of data) {
      if (i.DELETED === 1 && i.LOGIN_ATTEMPTS < this.paramValue && String(i.ORACLE_ID) !== 'null') {
        this.blockByTech++;
      }
      if (i.DELETED === 1 && i.LOGIN_ATTEMPTS === this.paramValue && String(i.ORACLE_ID) !== 'null') {
        this.blockAuthUsers++;
      }
    }
    this.usersNumber = this.usersNumber + this.blockByTech + this.blockAuthUsers;
  }


  getSubSystems(items) {
    for (const i of items) {
      if (i.AV_SYSTEMS[0] === '1') {
        this.delo++;
      }
      if (i.AV_SYSTEMS[1] === '1') {
        this.delowebLGO++;
      }
      if (i.AV_SYSTEMS[2] === '1') {
        this.SCAN++;
      }
      if (i.AV_SYSTEMS[3] === '1') {
        this.Pscan++;
      }
      if (i.AV_SYSTEMS[5] === '1') {
        this.Shif++;
      }
      if (i.AV_SYSTEMS[15] === '1') {
        this.Scan_code++;
      }
      if (i.AV_SYSTEMS[16] === '1') {
        this.Notifer++;
      }
      if (i.AV_SYSTEMS[17] === '1') {
        this.Search_code++;
      }
      if (i.AV_SYSTEMS[21] === '1') {
        this.EOS++;
      }
      if (i.AV_SYSTEMS[23] === '1') {
        this.MobNet++;
      }
      if (i.AV_SYSTEMS[25] === '1') {
        this.APM++;
      }
      if (i.AV_SYSTEMS[26] === '1') {
        this.Informer++;
      }
      if (i.AV_SYSTEMS[27] === '1') {
        this.delowebKL++;
      }
    }

    this.delowebLGO = this.delowebLGO - this.delo;
    this.subSysArray = [
      { subSystem: this.subsystem.delo.label, subValue: this.delo },
      { subSystem: this.subsystem.delowebLGO.label, subValue: this.delowebLGO },
      { subSystem: this.subsystem.delowebKL.label, subValue: this.delowebKL },
      { subSystem: this.subsystem.Shif.label, subValue: this.Shif },
      { subSystem: this.subsystem.SCAN.label, subValue: this.SCAN },
      { subSystem: this.subsystem.Pscan.label, subValue: this.Pscan },
      { subSystem: this.subsystem.Scan_code.label, subValue: this.Scan_code },
      { subSystem: this.subsystem.Search_code.label, subValue: this.Search_code },
      { subSystem: this.subsystem.Notifer.label, subValue: this.Notifer },
      { subSystem: this.subsystem.Informer.label, subValue: this.Informer },
      { subSystem: this.subsystem.EOS.label, subValue: this.EOS },
      { subSystem: this.subsystem.MobNet.label, subValue: this.MobNet },
      { subSystem: this.subsystem.APM.label, subValue: this.APM }
    ];
  }

}
