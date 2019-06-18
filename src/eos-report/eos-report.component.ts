import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'eos-eos-report',
  templateUrl: './eos-report.component.html',
  styleUrls: ['./eos-report.component.scss']
})
export class EosReportComponent implements OnInit {

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit() {

  }

}
