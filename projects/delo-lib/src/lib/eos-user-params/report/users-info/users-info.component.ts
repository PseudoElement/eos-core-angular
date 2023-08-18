import {
    Component,
    EventEmitter,
    Input, OnChanges,
    OnInit,
    Output, SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { RtUserSelectService } from '../../../eos-user-select/shered/services/rt-user-select.service';
import { Router } from '@angular/router';

@Component({
    selector: 'eos-users-info',
    templateUrl: './users-info.component.html',
    styleUrls: ['./users-info.component.scss'],
})
export class EosReportUsersInfoComponent implements OnChanges, OnInit {
    @Input() open: boolean = false;
    @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('usersInfo', { static: true }) usersInfo;
    users: any[];
    modalRef: BsModalRef;
    selectUser: any;
    isFirst: boolean;
    isLast: boolean;
    src: any;
    isShortReport: boolean = false;
    isProtocol: boolean = false
    CheckAllUsers: boolean = false;
    titleDownload: string;
    printUsers: any[] = [{ data: 'Текущем пользователе', value: false }, { data: 'Всех отмеченных пользователях', value: true }];
    private nodeIndex: number = 0;
    constructor(private _userParamSrv: UserParamsService,
                private modalService: BsModalService,
                private _router: Router,
                public sanitizer: DomSanitizer,
                public _rtSrv: RtUserSelectService,
                ) { }


    ngOnInit(): void{
        this.isProtocol = this._router.url.includes('/protocol')
        console.log("PROTOCOL", this.isProtocol)
    }
    ngOnChanges(changes: SimpleChanges) {
        if (this.open ) {
            this.init();
        } else if (!this.open && !changes.open.firstChange) {
            this.modalRef.hide();
        }
    }

    init() {
        this.users = this._userParamSrv.checkedUsers;
        if (this.users.length > 0) {
            this.selectUser = this.users[0];
            this.src = this.getHtmlStr(this.selectUser.id);
        }
        this.changeReportSize(false)
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
        return this.sanitizer.bypassSecurityTrustResourceUrl(`../CoreHost/FOP/UserRights/${id}`);
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

    public downloadShortReport() {
        this.InformationSelectedUsers(this.selectUser);
    }

    public changeReportSize(isShort: boolean): void{
        this.isShortReport = isShort;
    }

    download(filename, data) {
        const blob = new Blob([data], { type: 'text/html' });
        if (window.navigator['msSaveOrOpenBlob']) {
            window.navigator['msSaveBlob'](blob, filename);
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
        /* let NumberLine: number = 1;
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
        const info = this.CheckAllUsers ? `Краткие сведения по всем пользователям.html` : `Краткие сведения ${selectUser.login}.html`;
        this.download(info, sourceHTML); */

        const uData = [];
        const usersInfo = this.CheckAllUsers === true ? this.users : [selectUser];
        usersInfo.forEach(user => {
            uData.push({
                department: user.department,
                name: user.name,
                login: user.oracle_id === null ? 'УДАЛЕН' : user.login,
            });
        });
        this._userParamSrv.createShortReportHtml(uData);
    }

    // getHrefPrint(): string {
    //     if (this.CheckAllUsers) {
    //         let strId = '';
    //         this.users.forEach(user => {
    //             strId += user.id + ';';
    //         });
    //         this.titleDownload = 'Полные сведения по всем пользователям';
    //         return `../UserInfo/UserRights.ashx?uisn=${strId}`;
    //     } else {
    //         this.titleDownload = `Полные сведения ${this.selectUser.login}`;
    //         return `../UserInfo/UserRights.ashx?uisn=${this.selectUser.id}`;
    //     }
    // }

    close() {
        this.closeModal.emit(true);
    }

    public downloadFullReport() {
        let url = '';
        let title = '';

        if (this.CheckAllUsers) {
            let strId = '';
            this.users.forEach(user => {
                strId += user.id + ';';
            });
            title = 'Полные сведения по всем пользователям';
            url = `../CoreHost/FOP/UserRights/${strId}`;
        } else {
            console.log("SELECTED_USER",this.selectUser)
            title = this._getFileTitleFullReport()
            url = `../CoreHost/FOP/UserRights/${this.selectUser.id}`;
        }
        this._userParamSrv.createFullReportHtml(url, title);
    }
    private _getFileTitleFullReport(): string{
        const iframe = window.frames['iframe'].contentWindow
        const iframeContent = iframe.document.body.innerText as string
        const date = iframeContent.split('Дата: ')[1].slice(0, 16)
        if(this.isProtocol) return `Протокол редактирования пользователя ${this.selectUser.login} ${date}.html`
        else return `Полные сведения ${this.selectUser.login}`
    }
    public openPrintWindow(){
        const iframe = window.frames['iframe'].contentWindow
        iframe.focus()
        iframe.print()
    }
    private _updateBorders() {
        this.isFirst = this.nodeIndex <= 0;
        this.isLast = this.nodeIndex >= this.users.length - 1 || this.nodeIndex < 0;
    }
}
