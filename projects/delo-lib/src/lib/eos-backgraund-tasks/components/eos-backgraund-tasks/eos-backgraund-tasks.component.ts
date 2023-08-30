import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IFonLists } from '../../../eos-backgraund-tasks/interface';
import { FonTasksService } from '../../../eos-backgraund-tasks/services/fon-tasks.service';

@Component({
  selector: 'eos-eos-backgraund-tasks',
  templateUrl: './eos-backgraund-tasks.component.html',
  styleUrls: ['./eos-backgraund-tasks.component.scss']
})



export class EosBackgraundTasksComponent implements OnInit, OnDestroy {
  @ViewChild('containerTask', {static: true}) containerTask: ElementRef;
  lists: IFonLists[] = [];
  private _lastWrapperWidth: number;
  private _calcItemWidth: number;
  constructor(private _fonTasksSrv: FonTasksService) {
  }

  ngOnInit() {
    try {
      this.lists = this._fonTasksSrv.loadTaskLists().sort((a, b) => {
        if (a.title < b.title) {
            return 1;
        } else if (a.title > b.title) {
            return -1;
        } else {
            return 0;
        }
    });
    } catch (error) {
      console.log('Ошибка получения всех плагинов', error);
    }
  }


  ngOnDestroy(): void {
    this.lists = [];
  }
  itemWidth() {
    const w = this.containerTask?.nativeElement.clientWidth || window.innerWidth;
    if (!this.lists || w === this._lastWrapperWidth) {
        return this._calcItemWidth;
    }
    this._lastWrapperWidth = w;
    const padsPerElem = 30;
    const maxW: number = 490 + padsPerElem;
    const minW: number = 400 + padsPerElem;
    const dmin =  w / minW ;
    const dmax =  w / maxW ;
    const dmin_f = Math.floor(dmin);
    const dmax_f = Math.floor(dmax);
    if (dmax_f >= this.lists.length) {
        this._calcItemWidth = maxW - padsPerElem;
    } else if (dmin_f === dmax_f) {
        this._calcItemWidth =  maxW - padsPerElem;
    } else {
        this._calcItemWidth = (w / dmin_f) - padsPerElem;
    }
    return this._calcItemWidth;
  }
}
