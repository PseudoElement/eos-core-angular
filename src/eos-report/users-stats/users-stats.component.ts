import { Component, OnInit } from '@angular/core';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';

@Component({
  selector: 'eos-report-stats',
  templateUrl: './users-stats.component.html',
  styleUrls: ['./users-stats.component.scss']
})
export class EosReportUsersStatsComponent implements OnInit {
  subsystem: any;
  constructor(private _selectedUser: RtUserSelectService) {
    this.subsystem = this._selectedUser.ArraySystemHelper;
  }

  ngOnInit() {
    console.log(this.subsystem);
  }

}
