import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'eos-users-info',
  templateUrl: './users-info.component.html',
  styleUrls: ['./users-info.component.scss']
})
export class EosReportUsersInfoComponent implements OnInit {
  @Input() btnVal: any;
  users: any[];
  activeBtn: boolean;
  modalRef: BsModalRef;
  selectUser: any;
  isFirst: boolean;
  isLast: boolean;
  private nodeIndex: number = 0;
  constructor(private _userParamSrv: UserParamsService, private modalService: BsModalService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.users = this._userParamSrv.checkedUsers;
    if (this.users.length === 0) {
      this.activeBtn = false;
    } else {
      this.selectUser = this.users[this.nodeIndex];
      this.activeBtn = true;
    }
    this._updateBorders();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-info' }));
  }

  prev() {
    if (this.nodeIndex > 0) {
      this.nodeIndex--;
    }
    this.selectUser = this.users[this.nodeIndex];
    this._updateBorders();
  }

  next() {
    if (this.nodeIndex < this.users.length - 1) {
      this.nodeIndex++;
    }
    this.selectUser = this.users[this.nodeIndex];
    this._updateBorders();
  }

  PrintData() {
  }

  private _updateBorders() {
    this.isFirst = this.nodeIndex <= 0;
    this.isLast = this.nodeIndex >= this.users.length - 1 || this.nodeIndex < 0;
  }

}
