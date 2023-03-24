import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ETypeFon, IFonLists } from '../../../eos-backgraund-tasks/interface';

@Component({
  selector: 'eos-eos-background-list',
  templateUrl: './eos-background-list.component.html',
  styleUrls: ['./eos-background-list.component.scss']
})
export class EosBackgroundListComponent implements OnInit {

  @Input() list: IFonLists;
  disabled: boolean = false;
  constructor(private router: Router) { }

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
    try {
      if (list.type !== ETypeFon.popUp) {
        this.router.navigate(['/services', list.id]);
      } else {
        list.loadPlugin('eos-admin-fon-tasks');
      }
    } catch (error) {
      console.log('Ошибка в загрузке плагина');
    }
  }
}
