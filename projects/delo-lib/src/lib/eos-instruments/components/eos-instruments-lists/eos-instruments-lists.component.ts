import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IFonLists } from '../../../eos-backgraund-tasks/interface';
import { TOOLS_DICTIONARIES } from '../../../eos-dictionaries/consts/dictionaries/instruments/instruments.const';
import { EosAdmToolsService } from '../../../eos-instruments/services/EosAdmTools.service';

@Component({
  selector: 'eos-instruments-lists',
  templateUrl: './eos-instruments-lists.component.html',
  styleUrls: ['./eos-instruments-lists.component.scss']
})

export class EosInstrumentsListsComponent implements OnInit {
  // containerInstrument
  @ViewChild('containerInstrument') containerInstrument: ElementRef;
  public tools: IFonLists[] = [...TOOLS_DICTIONARIES];
  private _lastWrapperWidth: number;
  private _calcItemWidth: number;
  constructor(private _toolsSrv: EosAdmToolsService) {
  }

  ngOnInit(): void {
    try {
        this.tools.push(...this._toolsSrv.loadTaskLists()) ;
        this.tools = this.tools.sort((a, b) => {
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
  itemWidth() {
    const w = this.containerInstrument?.nativeElement.clientWidth || window.innerWidth;
    if (!this.tools || w === this._lastWrapperWidth) {
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
    if (dmax_f >= this.tools.length) {
        this._calcItemWidth = maxW - padsPerElem;
    } else if (dmin_f === dmax_f) {
        this._calcItemWidth =  maxW - padsPerElem;
    } else {
        this._calcItemWidth = (w / dmin_f) - padsPerElem;
    }
    return this._calcItemWidth;
  }

}
