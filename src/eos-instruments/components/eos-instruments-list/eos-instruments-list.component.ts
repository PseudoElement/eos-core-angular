import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DISABLED_LIST_ITEM } from 'app/consts/messages.consts';
import { ETypeFon, IFonLists } from 'eos-backgraund-tasks/interface';
import { OPENED_WINDOW } from 'eos-dictionaries/consts/dictionaries/instruments/instruments.const';



@Component({
  selector: 'eos-instruments-list',
  templateUrl: './eos-instruments-list.component.html',
  styleUrls: ['./eos-instruments-list.component.scss']
})
export class EosInstrumentsListComponent implements OnDestroy, OnInit {

  @Input() list: IFonLists;
  disabled: boolean = false;

  constructor(private router: Router) {

  }
  ngOnInit() {
    if (this.list.checkAccess) {
      this.list.checkAccess().then(access => {
        this.disabled = access;
      });
    } else {
      this.disabled = true;
    }
  }

  public setCurentTask(list: IFonLists) {
    if (list.type !== ETypeFon.popUp) {
      this.router.navigate(['/instruments', list.id]);
    } else {
      list.loadPlugin('eos-admin-instruments');
    }
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
