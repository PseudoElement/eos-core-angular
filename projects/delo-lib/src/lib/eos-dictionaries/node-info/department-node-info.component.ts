import {Component, OnChanges, OnDestroy} from '@angular/core';
import {BaseNodeInfoComponent} from './base-node-info';
import {ROLES_IN_WORKFLOW} from '../consts/dictionaries/department.consts';
import {CreateUserComponent} from '../../eos-user-select/list-user-select/createUser/createUser.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {DictionaryDescriptorService} from '../core/dictionary-descriptor.service';
import {EosDictionary} from '../core/eos-dictionary';
import {EosDictionaryNode} from '../core/eos-dictionary-node';
import { EosAccessPermissionsService } from '../../eos-dictionaries/services/eos-access-permissions.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { Features } from '../../eos-dictionaries/features/features-current.const';
import { CB_FUNCTIONS, AppContext } from '../../eos-rest/services/appContext.service';
import { E_RECORD_ACTIONS } from '../../eos-dictionaries/interfaces';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { DELO_OWNER } from '../../eos-rest/interfaces/structures';
import { DEPARTMENT } from '../../eos-rest/interfaces/structures';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

@Component({
    selector: 'eos-department-node-info',
    templateUrl: 'department-node-info.component.html',
})
export class DepartmentNodeInfoComponent extends BaseNodeInfoComponent implements OnChanges, OnDestroy {
    public photo;
    public update: boolean;
    public canCreateUser: boolean;
    public roles = ROLES_IN_WORKFLOW;
    public urlPathUser = 'base-param';
    createUserModal: BsModalRef;

    boss: EosDictionaryNode;
    department: string;
    isCBBase: boolean;
    private _unsebscribe = new Subject();

    get viewRedirect() {
        return this.dictSrv?.viewParameters?.searchResults || (this.nodeDataFull.rec.PARENT_DUE !== this._router.url.split('/').pop());
    }
    constructor(
        private _modalSrv: BsModalService,
        private _descrSrv: DictionaryDescriptorService,
        private _eaps: EosAccessPermissionsService,
        private _msgSrv: EosMessageService,
        private _appctx: AppContext,
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private dictSrv: EosDictService,
        private _router: Router,
        private pipRX: PipRX
    ) {
        super();
        this.isCBBase = this._appctx.getParams(CB_FUNCTIONS) === 'YES';
        this.canCreateUser = false;
        if (!this.isCBBase && Features.cfg.departments.userCreateButton) {
            this.canCreateUser = this._eaps.isAccessGrantedForUsers();
        }
        this.dictSrv.updateRigth.pipe(takeUntil(this._unsebscribe)).subscribe(r => {
            this.ngOnChanges();
        });
    }

    async ngOnChanges() {
        super.ngOnChanges();
        this.boss = null;
        if (this.node) {
            if ((!this.node.data.rec['IS_NODE']) && (this.node.children)) {

                const dict = new EosDictionary(E_DICTIONARY_ID.DEPARTMENTS, this._descrSrv);
                dict.descriptor.getBoss(this.node.id)
                    .then((boss) => {
                        if (boss) {
                            this.boss = new EosDictionaryNode(dict, boss);
                        }
                    });
            } else {
                if (this.node.parent) {
                    if (this.node.parent.id === '0.') {
                        this.department = await this.getNameOrganization();
                    } else {
                        this.department = await this.getFullPathDepartment(this.node.parent.id);
                    }
                    if (this.node.data.photo && this.node.data.photo.url) {
                        this.photo = this.node.data.photo.url;
                    } else {
                        this.photo = null;
                    }
                }
            }
        }
    }

    async getNameOrganization(): Promise<string> {
        const result: DELO_OWNER[] = await this.pipRX.read({ DELO_OWNER: { criteries: '', top: 1, skip: 0 }});
        return result[0].NAME;
    }

    async getFullPathDepartment(parentId: string) {
        let path: string = '';
        let due = parentId.split('.').map(el => el += '.');
        due.pop();
        const resultDue = [];
        let curentDue: string = '';
        due.forEach(el => {
            curentDue += el;
            resultDue.push(curentDue);
        })

        const result: DEPARTMENT[] = await this.pipRX.read({ DEPARTMENT: {criteries: {DUE: resultDue.join('|')}}});
        result.forEach( el => {
            if (el.DUE === "0.") {
                path = el.CARD_NAME + path;
            } else {
                path = el.CLASSIF_NAME + ' - ' + path;
            }
        })
        return path;
    }

    ngOnDestroy() {
        this._unsebscribe.next();
        this._unsebscribe.complete();
    }

    redirectToEditCabinet($event): void {
        $event.preventDefault();
        this.dictSrv.deleteDict(1);
        setTimeout(() => {
            this._router.navigate(['spravochniki', E_DICTIONARY_ID.CABINET, this.nodeDataFull.cabinet.ISN_CABINET, 'view']);
        });
    }
    resetSearch() {
        this.dictSrv.updateResetSerch();
    }

    redirectToDepartment($event): void {
        $event.preventDefault();
        this.dictSrv.deleteDict(1);
        setTimeout(() => {
            this._router.navigate(['spravochniki', E_DICTIONARY_ID.DEPARTMENTS, this.nodeDataFull.rec.PARENT_DUE]);
        });
    }

    getRole(value: number): string {
        let sRole = this.roles.find((elem) => elem.value === value);
        if (!sRole) {
            sRole = this.roles[0];
        }
        return sRole.title;
    }

    getUserLogin() {
        if (this.nodeDataFull.user && this.nodeDataFull.user.CLASSIF_NAME) {
            return this.nodeDataFull.user.CLASSIF_NAME;
        }
        return false;
    }

    createUser() {
        if (this.canCreateUser) {
            this.createUserModal = this._modalSrv.show(CreateUserComponent, {
                class: 'param-create-user',
                ignoreBackdropClick: true,
            });
            this.createUserModal.content.initDue = this.node.data.rec['DUE'];
            this.createUserModal.content.initLogin = this.fioTogin(this.node.data.rec['CLASSIF_NAME']);
            this.createUserModal.content.closedModal.subscribe(() => {
                this.createUserModal.hide();
            });
        } else {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение:',
                msg: 'У Вас нет права изменять параметры модуля "Пользователи"',
            });
        }
    }

    toTranslit(text: string): string {
        return text.replace(/([а-яё])|([\s_-])|([^a-z\d])/gi,
            function (all, ch, space, words, i) {
                if (space || words) {
                    return space ? '-' : '';
                }
                const code = ch.charCodeAt(0),
                    index = code === 1025 || code === 1105 ? 0 :
                        code > 1071 ? code - 1071 : code - 1039,
                    t = ['yo', 'a', 'b', 'v', 'g', 'd', 'e', 'zh',
                        'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p',
                        'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh',
                        'shch', '', 'y', '', 'e', 'yu', 'ya'
                    ];
                return t[index];
            });
    }

    getFullName(): string {
        let res = '';
        const f = this.nodeDataFull['printInfo']['SURNAME'];
        const i = this.nodeDataFull['printInfo']['NAME'];
        const o = this.nodeDataFull['printInfo']['PATRON'];

        res += f ? f : '';
        res += i ? ' ' + i + (i.length === 1 ? '.' : '') : '';
        res += o ? ' ' + o + (o.length === 1 ? '.' : '') : '';

        return res;
    }

    openCardOrganiz() {
        this._breadcrumbsSrv.sendAction({action: E_RECORD_ACTIONS.edit, params: {outside: true}});
    }

    private fioTogin(text: string) {
        return this.toTranslit(text.replace(/ /g, '').replace(/-/g, '').replace(/\./g, '').slice(0, 12));
    }
}
