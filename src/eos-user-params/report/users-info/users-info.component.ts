import {
    Component,
    EventEmitter,
    Input, OnChanges,
    Output, SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';
import { UserSelectNode } from 'eos-user-select/list-user-select/user-node-select';

@Component({
    selector: 'eos-users-info',
    templateUrl: './users-info.component.html',
    styleUrls: ['./users-info.component.scss']
})
export class EosReportUsersInfoComponent implements OnChanges {
    @Input() open: boolean = false;
    @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('usersInfo') usersInfo;
    users: any[];
    modalRef: BsModalRef;
    selectUser: any;
    isFirst: boolean;
    isLast: boolean;
    src: any;
    shortRep: boolean = false;
    CheckAllUsers: boolean = false;
    titleDownload: string;
    printUsers: any[] = [{ data: 'Текущем пользователе', value: false }, { data: 'Всех отмеченных пользователях', value: true }];
    private nodeIndex: number = 0;
    constructor(private _userParamSrv: UserParamsService,
                private modalService: BsModalService,
                public sanitizer: DomSanitizer,
                public _rtSrv: RtUserSelectService) { }


    ngOnChanges(changes: SimpleChanges) {
        if (this.open ) {
            this.init();
        } else if (!this.open && !changes.open.firstChange) {
            this.modalRef.hide();
        }
    }

    init() {
        this.users = this._userParamSrv.checkedUsers.filter((user: UserSelectNode) => user.isEditable);
        if (this.users.length > 0) {
            this.selectUser = this.users[0];
            this.src = this.getHtmlStr(this.selectUser.id);
        }
        this.shortRep = false;
        this.CheckAllUsers = false;
        this.nodeIndex = 0;
        this._updateBorders();
        setTimeout(() => {
            this.openModal(this.usersInfo);
        }, 0);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-info', ignoreBackdropClick: true }, ));
    }
    getHtmlStr(id: number): any {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`../UserInfo/UserRights.ashx?uisn=${id}`);
    }
    prev() {
        if (this.nodeIndex > 0) {
            this.nodeIndex--;
        }
        this.selectUser = this.users[this.nodeIndex];
        this.src = this.getHtmlStr(this.selectUser.id);
        this._updateBorders();
    }

    next() {
        if (this.nodeIndex < this.users.length - 1) {
            this.nodeIndex++;
        }
        this.selectUser = this.users[this.nodeIndex];
        this.src = this.getHtmlStr(this.selectUser.id);
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
        const time = new Date().toLocaleString();
        const header = `Краткие сведения о выбранных пользователях\r\n ${time}\r\n №; Подразделение; Фамилия; Имя;\r\n`;
        this.CheckAllUsers === true ?
            this.users.forEach(user => {
                informationContent = informationContent + `${NumberLine}; ${user.department === '...' ? '' : user.department}; ${user.name}; ${user.oracle_id === null ? 'УДАЛЕН' : user.login};\r\n`;
                NumberLine++;
            })
            : informationContent = `${NumberLine}; ${selectUser.department === '...' ? '' : selectUser.department}; ${selectUser.name}; ${selectUser.oracle_id === null ? 'УДАЛЕН' : selectUser.login};`;
        const sourceHTML = encoding + header + informationContent;
        const info = this.CheckAllUsers ? `Краткие сведения по всем пользователям.csv` : `Краткие сведения ${selectUser.login}.csv`;
        this.download(info, sourceHTML);
    }

    getHrefPrint(): string {
        if (this.CheckAllUsers) {
            let strId = '';
            this.users.forEach(user => {
                strId += user.id + ';';
            });
            this.titleDownload = 'Полные сведения по всем пользователям';
            return `../UserInfo/UserRights.ashx?uisn=${strId}`;
        } else {
            this.titleDownload = `Полные сведения ${this.selectUser.login}`;
            return `../UserInfo/UserRights.ashx?uisn=${this.selectUser.id}`;
        }
    }

    close() {
        this.closeModal.emit(true);
    }

    private _updateBorders() {
        this.isFirst = this.nodeIndex <= 0;
        this.isLast = this.nodeIndex >= this.users.length - 1 || this.nodeIndex < 0;
    }
}
