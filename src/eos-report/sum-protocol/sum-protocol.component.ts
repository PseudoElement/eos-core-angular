import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'eos-sum-protocol',
  templateUrl: './sum-protocol.component.html',
  styleUrls: ['./sum-protocol.component.scss']
})
export class EosReportSummaryProtocolComponent implements OnInit {
  dataDate = 'dataDate';
  dataEvent = 'dataEvent';
  dataEdit = 'dataEdit';
  dataUsers = 'dataUsers';

  @ViewChild('full') fSearchPop;

  constructor() { }

  ngOnInit() {
  }

}
