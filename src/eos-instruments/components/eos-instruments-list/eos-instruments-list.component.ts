import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DISABLED_LIST_ITEM } from 'app/consts/messages.consts';
import { ETypeFon, IFonLists } from 'eos-backgraund-tasks/interface';
import { OPENED_WINDOW } from 'eos-dictionaries/consts/dictionaries/instruments/instruments.const';
import { AppContext } from 'eos-rest/services/appContext.service';



@Component({
  selector: 'eos-instruments-list',
  templateUrl: './eos-instruments-list.component.html',
  styleUrls: ['./eos-instruments-list.component.scss']
})
export class EosInstrumentsListComponent implements OnDestroy, OnInit {

  @Input() list: IFonLists;
  disabled: boolean = false;

  constructor(
    private router: Router,
    private _appContext: AppContext,
    ) {

  }
  ngOnInit() {
    if (this.list.checkAccess) {
      this.list.checkAccess().then(access => {
        switch (this.list.id) {
          case 'CHANGE_DL':
            this.disabled =  this._appContext.CurrentUser['TECH_RIGHTS'][28] !== '1';
            break;
          default:
            this.disabled = !access;
            break;
        }
      });
    } else {
      this.disabled = true;
    }
  }

  public setCurentTask(list: IFonLists) {
    if (list.type !== ETypeFon.popUp) {
      this.router.navigate(['/tools', list.id]);
    } else {
      list.loadPlugin('eos-admin-tools-tasks');
    }
  }
  getIcon(list) {
    return list.icon.indexOf('.svg') === -1 ? '' : `url('${list.icon}')`;
  }
  getHint(): string {
    return this.disabled ? DISABLED_LIST_ITEM : '';
  }

  ngOnDestroy(): void {
    Object.keys(OPENED_WINDOW).forEach(key => {
      OPENED_WINDOW[key] = null;
    });
  }
}
