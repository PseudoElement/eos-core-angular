import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'eos-eos-report',
  templateUrl: './eos-report.component.html',
  styleUrls: ['./eos-report.component.scss']
})
export class EosReportComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {

  }

  switchToInfo() {
    this.router.navigate(['/report/users-info']);
  }

  switchToStats() {
    this.router.navigate(['/report/users-stats']);
  }

}
