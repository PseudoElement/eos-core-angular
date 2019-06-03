import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'eos-temp-sum-protocol',
  templateUrl: './temp-sum-protocol.component.html',
  styleUrls: ['./temp-sum-protocol.component.scss']
})
export class EosReportTempSumProtocolComponent implements OnInit {
  @Input() dataDate;
  @Input() dataEvent;
  @Input() dataEdit;
  @Input() dataUsers;

  constructor() {
  }

  ngOnInit() {

  }
}
