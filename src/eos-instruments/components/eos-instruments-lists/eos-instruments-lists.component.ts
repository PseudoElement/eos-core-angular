import { Component } from '@angular/core';
import { IFonLists } from 'eos-backgraund-tasks/interface';
import { INSTRUMENTS_DICTIONARIES } from 'eos-dictionaries/consts/dictionaries/instruments/instruments.const';

@Component({
  selector: 'eos-instruments-lists',
  templateUrl: './eos-instruments-lists.component.html',
  styleUrls: ['./eos-instruments-lists.component.scss']
})



export class EosInstrumentsListsComponent {

  public instruments: IFonLists[] = INSTRUMENTS_DICTIONARIES;
  constructor() {
  }


}
