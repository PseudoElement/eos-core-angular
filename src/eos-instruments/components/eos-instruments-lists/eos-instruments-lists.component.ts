import { Component, OnInit } from '@angular/core';
import { IFonLists } from 'eos-backgraund-tasks/interface';
import { TOOLS_DICTIONARIES } from 'eos-dictionaries/consts/dictionaries/instruments/instruments.const';
import { EosAdmToolsService } from 'eos-instruments/services/EosAdmTools.service';

@Component({
  selector: 'eos-instruments-lists',
  templateUrl: './eos-instruments-lists.component.html',
  styleUrls: ['./eos-instruments-lists.component.scss']
})



export class EosInstrumentsListsComponent implements OnInit {

  public tools: IFonLists[] = [...TOOLS_DICTIONARIES];
  constructor(private _toolsSrv: EosAdmToolsService) {
  }

  ngOnInit(): void {
    try {
      this.tools.push(...this._toolsSrv.loadTaskLists()) ;
    } catch (error) {
      console.log('Ошибка получения всех плагинов', error);
    }
  }


}
