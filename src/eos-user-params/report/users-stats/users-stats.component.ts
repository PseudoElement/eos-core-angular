import { Component, OnInit } from '@angular/core';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';
import { PipRX, USER_CL, USER_PARMS } from 'eos-rest';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { ALL_ROWS } from 'eos-rest/core/consts';
/* import { ALL_ROWS } from 'eos-rest/core/consts'; */
/* import { AppContext } from 'eos-rest/services/appContext.service'; */

@Component({
  selector: 'eos-report-stats',
  templateUrl: './users-stats.component.html',
  styleUrls: ['./users-stats.component.scss']
})
export class EosReportUsersStatsComponent implements OnInit {
  subsystem: any;
  serverSystem: any;
  items: [] = [];
  users: USER_CL[] = [];
  blockByTech: number = 0;
  blockAuthUsers: number = 0;
  usersNumber: number = 0;
  paramValue: number;
  logUsers: string;
  subSysArray = [];
  subServerArray = [];
  protUsers;
  deletedUsers;


  constructor(
    private _selectedUser: RtUserSelectService,
    private pip: PipRX,
    private _errorSrv: ErrorHelperServices,
    /* private _appContext: AppContext, */
    ) {
    const ArraySystem = Object.assign({}, this._selectedUser.ArraySystemHelper);
    const serverSystem = Object.assign({}, this._selectedUser.ArrayServerHelper);
    this.subsystem = this.deletDeloDeloWeb(ArraySystem);
    this.serverSystem = serverSystem;
  }
  get systemRegistr() {
      return this.items.length === 0 ? 'Система не зарегистрирована' : 'Система зарегистрирована';
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    const a = this.pip.read<USER_CL>({
      USER_CL: PipRX.criteries({ 'DELETED': '0', 'ISN_LCLASSIF': '1:null' }),
      loadmode: 'Table'
    }).then((r: any) => {
      this.users = r;
    })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
    /* this.items = this._appContext.sysLicenseInfo; */
    const b = this.pip.read<USER_PARMS>({
      USER_PARMS: PipRX.criteries({ 'PARM_NAME': 'MAX_LOGIN_ATTEMPTS|USER_EDIT_AUDIT' })
    }).then((r: any) => {
      if (r[1].PARM_VALUE === 'NO') {
        this.logUsers = 'Выключено';
      } else {
        this.logUsers = 'Включено';
      }
      this.paramValue = parseInt(r[0].PARM_VALUE, 10);
    })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });

    const c = this.pip.read<USER_CL>({
      USER_CL: PipRX.criteries({ 'DELETED': '1' }),
      loadmode: 'Table'
    })
      .then((r: any) => {
        this.deletedUsers = r;
      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
    const d =  this.pip.read<any>({
      'LicenseInfo': ALL_ROWS
    })
    .then((licenz: any) => {
      let ans = licenz;
      if (typeof(ans) === 'string') {
          ans = JSON.parse(ans);
      }
      this.items = ans;
    })
    .catch(er => {
      this.items = [];
      /* this._errorSrv.errorHandler(er); */
    });
    Promise.all([a, b, c, d]).then(() => {
      this.getSubSystems(this.items);
      this.usersNumber = this.usersNumber + this.users.length;
      this.getProtectedUsers(this.deletedUsers, this.usersNumber);
    }
    )
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
  }
  deletDeloDeloWeb(any) {
    delete any['delo_deloweb'];
    return any;
  }

  getProtectedUsers(data: any, usNum: number) {
    for (const i of data) {
      if (i.DELETED === 1 && i.LOGIN_ATTEMPTS < this.paramValue && String(i.ORACLE_ID) !== 'null') {
        this.blockByTech++;
      }
      if (i.DELETED === 1 && i.LOGIN_ATTEMPTS === this.paramValue && String(i.ORACLE_ID) !== 'null') {
        this.blockAuthUsers++;
      }
    }
    this.usersNumber = usNum + this.blockByTech + this.blockAuthUsers;
  }


  getSubSystems(items: any[]) {
    const masFull = '0000000000000000000000000000'.split('').map(elem => Number(elem));
    this.users.forEach((user, index) => {
        const nUser = user['AV_SYSTEMS'].trim().split('').map(elem => Number(elem));
        masFull.forEach((element, numb) => {
          if (numb === 1) {
            masFull[numb] += nUser[numb] === 1 && nUser[numb] === 0 ? 1 : 0;
          } else {
            if (typeof(nUser[numb]) === 'number') {
              masFull[numb] += nUser[numb];
            }
          }
        });
    });
    items.forEach(elem => {
      if (elem.Id === 1) {
        this.subsystem.delo.Users = elem.Users;
        this.subsystem.delo.ActualUsers = elem.ActualUsers;
        this.subsystem.delo.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 2) {
        this.subsystem.delowebLGO.Users = elem.Users;
        this.subsystem.delowebLGO.ActualUsers = elem.ActualUsers;
        this.subsystem.delowebLGO.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 3) {
        this.subsystem.SCAN.Users = elem.Users;
        this.subsystem.SCAN.ActualUsers = elem.ActualUsers;
        this.subsystem.SCAN.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 4) {
        this.subsystem.Pscan.Users = elem.Users;
        this.subsystem.Pscan.ActualUsers = elem.ActualUsers;
        this.subsystem.Pscan.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 6) {
        this.subsystem.Shif.Users = elem.Users;
        this.subsystem.Shif.ActualUsers = elem.ActualUsers;
        this.subsystem.Shif.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 16) {
        this.subsystem.Scan_code.Users = elem.Users;
        this.subsystem.Scan_code.ActualUsers = elem.ActualUsers;
        this.subsystem.Scan_code.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 17) {
        this.subsystem.Notifer.Users = elem.Users;
        this.subsystem.Notifer.ActualUsers = elem.ActualUsers;
        this.subsystem.Notifer.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 18) {
        this.subsystem.Search_code.Users = elem.Users;
        this.subsystem.Search_code.ActualUsers = elem.ActualUsers;
        this.subsystem.Search_code.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 22) {
        this.subsystem.EOS.Users = elem.Users;
        this.subsystem.EOS.ActualUsers = elem.ActualUsers;
        this.subsystem.EOS.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 24) {
        this.subsystem.MobNet.Users = elem.Users;
        this.subsystem.MobNet.ActualUsers = elem.ActualUsers;
        this.subsystem.MobNet.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 26) {
        this.subsystem.APM.Users = elem.Users;
        this.subsystem.APM.ActualUsers = elem.ActualUsers;
        this.subsystem.APM.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 27) {
        this.subsystem.Informer.Users = elem.Users;
        this.subsystem.Informer.ActualUsers = elem.ActualUsers;
        this.subsystem.Informer.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 28) {
        this.subsystem.delowebKL.Users = elem.Users;
        this.subsystem.delowebKL.ActualUsers = elem.ActualUsers;
        this.subsystem.delowebKL.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      // server
      if (elem.Id === 32) {
        this.serverSystem.server_web.Trial = '+'; // elem.Trial;
        this.serverSystem.server_web.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 33) {
        this.serverSystem.server_EP.Trial = '+'; // elem.Trial;
        this.serverSystem.server_EP.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 31) {
        this.serverSystem.systemProces.Trial = '+'; // elem.Trial;
        this.serverSystem.systemProces.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 23) {
        this.serverSystem.SEW.Trial = '+'; // elem.Trial;
        this.serverSystem.SEW.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 21) {
        this.serverSystem.mail.Trial = '+'; // elem.Trial;
        this.serverSystem.mail.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 25) {
        this.serverSystem.MEDO.Trial = '+'; // elem.Trial;
        this.serverSystem.MEDO.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 30) {
        this.serverSystem.AC_OG.Trial = '+'; // elem.Trial;
        this.serverSystem.AC_OG.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 29) {
        this.serverSystem.webWork.Trial = '+'; // elem.Trial;
        this.serverSystem.webWork.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 34) {
        this.serverSystem.work_OG.Trial = '+'; // elem.Trial;
        this.serverSystem.work_OG.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 35) {
        this.serverSystem.MEDO_2_7.Trial = '+'; // elem.Trial;
        this.serverSystem.MEDO_2_7.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 36) {
        this.serverSystem.PPO_SSTY.Trial = '+'; // elem.Trial;
        this.serverSystem.PPO_SSTY.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 37) {
        this.serverSystem.MRCHART.Trial = '+'; // elem.Trial;
        this.serverSystem.MRCHART.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
      if (elem.Id === 38) {
        this.serverSystem.MTG.Trial = '+'; // elem.Trial;
        this.serverSystem.MTG.Expired = elem.Expired ? elem.Expired.slice(0, elem.Expired.indexOf('T')) : '-';
      }
    });

    // this.delowebLGO = this.items.length - this.delo - this.delowebKL;
    Object.keys(this.subsystem).forEach(key => {
      if (masFull[this.subsystem[key].id - 1] !== 0 && this.subsystem[key].ActualUsers === 0) {
        this.subsystem[key].ActualUsers = masFull[this.subsystem[key].id - 1];
      }
      this.subSysArray.push(this.subsystem[key]);
    });
    Object.keys(this.serverSystem).forEach(key => {
      this.subServerArray.push(this.serverSystem[key]);
    });
  }

  checkUsersLimits (subItem): boolean {
    if (subItem) {
      const setZeroHours = date => date.setHours(0, 0, 0, 0);

      const expiredDate = new Date(subItem.Expired);
      const currentDate = new Date();

      return (this.items.length > 0 && subItem.Users && subItem.Users < subItem.ActualUsers) ||
      (+expiredDate && setZeroHours(expiredDate) < setZeroHours(currentDate));
    }

    return true;
  }
}
