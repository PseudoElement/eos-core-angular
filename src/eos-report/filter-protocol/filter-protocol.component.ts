import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'eos-filter-protocol',
  templateUrl: './filter-protocol.component.html',
  styleUrls: ['./filter-protocol.component.scss']
})
export class EosReportSummaryFilterProtocolComponent implements OnInit {

  formBol: boolean = false;
  constructor() { }
  ngOnInit() {
  }
  isActiveButton(): boolean {
    this.formBol = true;
    return this.formBol;
  }
  OutsideClick() {
    this.formBol = false;
    return this.formBol;
  }

}
