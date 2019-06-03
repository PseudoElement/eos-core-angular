import { Component, OnInit } from '@angular/core';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';

import { PipRX, USER_CL, USER_PARMS } from 'eos-rest';

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
  usersNumber: number;
  paramValue: number;
  logUsers: string;

  delo: number = 0; delowebLGO: number = 0; delowebKL: number = 0;
  Shif: number = 0; SCAN: number = 0; Pscan: number = 0; Scan_code: number = 0;
  Search_code: number = 0; Notifer: number = 0; Informer: number = 0;
  EOS: number = 0; MobNet: number = 0; APM: number = 0;

  constructor(private _selectedUser: RtUserSelectService, private pip: PipRX) {
    this.subsystem = this._selectedUser.ArraySystemHelper;
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.pip.read<USER_CL>({
      USER_CL: PipRX.criteries({ 'DELETED': '0', 'PROTECTED': '0' })
    }).then(r => {
      this.items = r;
      this.usersNumber = r.length;
      this.getSubSystems(this.items);
    });
    this.pip.read<USER_PARMS>({
      USER_PARMS: PipRX.criteries({ 'PARM_NAME': 'MAX_LOGIN_ATTEMPTS' })
    }).then(r => {
      this.paramValue = parseInt(r[0].PARM_VALUE, 10);
    });
    this.pip.read<USER_PARMS>({
      USER_PARMS: PipRX.criteries({ 'PARM_NAME': 'USER_EDIT_AUDIT' })
    }).then(r => {
      if (r[0].PARM_VALUE === 'NO') {
        this.logUsers = 'Не выполнено';
      } else {
        this.logUsers = 'Выполнено';
      }
    });


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
      if (i.DELETED === '1' && i.LOGIN_ATTEMPTS < this.paramValue) {
        this.blockByTech++;
      }
      if (i.DELETED === '1' && i.LOGIN_ATTEMPTS === this.paramValue) {
        this.blockAuthUsers++;
      }
    }
    this.delowebLGO = this.delowebLGO - this.delo;
  }

}
