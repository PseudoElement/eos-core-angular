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
  CheckAllUsers: boolean = false;
  printUsers: any[] = [{ data: 'Текущем пользователе', value: false }, { data: 'Всех отмеченных пользователях', value: true }];
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
    this.InformationSelectedUsers(this.selectUser);
  }

  download(filename, data) {
    const blob = new Blob([data], { type: 'text/csv' });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }

  InformationSelectedUsers(selectUser: any): void {
    let NumberLine: number = 1;
    let informationContent: String = '';
    const encoding = '\uFEFF';
    const header = '№; Подразделение;;;;;;; Фамилия;;; Имя;;;\r\n';
    this.CheckAllUsers === true ?
      this.users.forEach(user => {
        informationContent = informationContent + `${NumberLine}; ${user.department};;;;;;; ${user.name};;; ${user.login};;;\r\n`;
        NumberLine++;
      })
      : informationContent = `${NumberLine}; ${selectUser.department};;;;;;; ${selectUser.name};;; ${selectUser.login};;;`;
    const sourceHTML = encoding + header + informationContent;
    const info = this.CheckAllUsers ? `Краткие сведенья по всем пользователям.csv` : `Краткие сведенья ${selectUser.login}.csv`;
    this.download(info, sourceHTML);
  }

  private _updateBorders() {
    this.isFirst = this.nodeIndex <= 0;
    this.isLast = this.nodeIndex >= this.users.length - 1 || this.nodeIndex < 0;
  }

}
