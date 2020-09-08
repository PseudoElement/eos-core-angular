import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserParamsService } from '../shared/services/user-params.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
@Component({
    selector: 'eos-user-params-header',
    styleUrls: ['user-header.component.scss'],
    templateUrl: 'user-header.component.html'
})
export class UserHeaderComponent implements OnInit {
    selfLink: any;
    link: any;
    @Input() editMode: boolean = false;
    @Input() title: string;
    @Input() disableBtn: boolean;
    @Input() defaultBtn?: boolean = false;
    @Input() errorSave: boolean = false;
    @Output() defaultEmit = new EventEmitter<any>();
    @Output() submitEmit = new EventEmitter<any>();
    @Output() cancelEmit = new EventEmitter<boolean>();
    @Output() editEmit = new EventEmitter<boolean>();
    get checkSegment() {
        const segmentsUrl = this._router.parseUrl(this._router.url).root.children.primary.segments;
        if (segmentsUrl.length && segmentsUrl.length > 2 && segmentsUrl[1].path === 'current-settings') {
            return true;
        }
        return false;
    }
    constructor(
        private _userServices: UserParamsService,
        private _router: Router
    ) {
        this.selfLink = this._router.url.split('?')[0];
        this.link = this._userServices.userContextId;
    }
    ngOnInit() {
        if (this.checkSegment) {
            setTimeout(() => {
                this.editMode  = true;
                this.editEmit.emit(this.editMode);
            });
        }
    }
    default() {
        this.defaultEmit.emit('');
    }

    cancel() {
        if (this.checkSegment) {
            window.close();
            return;
        }
        this.editMode = false;
        this.cancelEmit.emit(false);
    }
    submit() {
        if (this.disableBtn) {
            this.cancel();
        } else {
            this.submitEmit.emit(false);
        }
    }
    edit() {
        this.editMode = !this.editMode;
        this.editEmit.emit(this.editMode);
    }
    close() {
        if (this.checkSegment) {
            window.opener.close();
            return;
        }
        const queryRout = JSON.parse(localStorage.getItem('lastNodeDue'));
        let id;
        queryRout ? id = queryRout : id = '0.';
        this._router.navigate(['user_param', id]);
    }
    async saveFile() {
        const data = await this._userServices.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List',
            shortSys: true
        });
        if (!data) {
            return data;
        }

        const getUserTable = () => {
            const isn = this._userServices.curentUser.ISN_LCLASSIF;
            const surname = this._userServices.curentUser.SURNAME_PATRON;
            const login = this._userServices.curentUser.CLASSIF_NAME;

            return `
            <table>
                <caption>Пользователь</caption>
                <tr>
                    <th>ISN</th>
                    <th>ФИО</th>
                    <th>Логин</th>
                </tr>

                <tr>
                    <td>${isn}</td>
                    <td>${surname}</td>
                    <td>${login}</td>
                </tr>

            </table>
            `;
        };

        const getSettingsData = () => {
            let t = '';

            this._userServices.curentUser.USER_PARMS_List.forEach((param) => {
                let parmValue = param.PARM_VALUE || '';
                let parmName = param.PARM_NAME || '';

                // условия для переноса слов в строках
                // для нормального отображения в Microsoft Word
                if (parmValue.indexOf(';') !== -1) {
                    parmValue = parmValue.replace(/\;/gi, ';\r');
                } else if (parmValue.indexOf(',') !== -1) {
                    parmValue = parmValue.replace(/\,/gi, ',\r');
                } else if (parmValue.length > 35) {
                    const values = parmValue.split('');
                    parmValue = '';
                    values.forEach((v, i) => {
                        const val = (i % 35 === 0 && i >= 35) ? v + '\r' : v;
                        parmValue += val;
                    });
                }
                if (parmName.length > 10) {
                    const names = parmName.split('_');
                    parmName = '';
                    names.forEach((n, i) => {
                        let updatedN = (i + 1 === names.length) ? n : n + '_';
                        if (i % 2 === 0) {
                            updatedN += '\n';
                        }
                        parmName += updatedN;
                    });
                }

                const textData = `
                <tr>
                    <td>${parmName}</td>
                    <td>${param.PARM_GROUP}</td>
                    <td>${parmValue}</td>
                </tr>
                `;

                t = t + textData;
            });

            return t;
        };

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Настройки пользователя</title>
          <style>
            table {
              margin: 1em;
              border: 1px solid black;
              border-collapse: collapse;
            }
            caption {
              font-size: 22px;
              font-weight: bold;
            }
            th {
              border: 1px solid black;
              font-size: 16px;
              padding: .5em;
              min-width: 100px;
              max-width: 400px;
            }
            td {
              border: 1px solid black;
              font-size: 16px;
              padding: .5em;
              min-width: 100px;
              max-width: 400px;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>

          ${getUserTable()}

          <table>
            <caption>Настройки пользователя</caption>
            <tr>
              <th>Имя параметра</th>
              <th>Группа параметра</th>
              <th>Значение параметра</th>
            </tr>

            ${getSettingsData()}

          </table>
        </body>
        </html>
        `;
        const blobHtml = new Blob([html], {type: 'text/html;charset=utf-8'});
        saveAs(blobHtml, 'Настройки пользователя.html');
    }
}
