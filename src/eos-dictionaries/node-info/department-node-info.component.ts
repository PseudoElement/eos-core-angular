import {Component, OnChanges} from '@angular/core';
import {BaseNodeInfoComponent} from './base-node-info';
import {ROLES_IN_WORKFLOW} from '../consts/dictionaries/department.consts';
import {CreateUserComponent} from '../../eos-user-select/list-user-select/createUser/createUser.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {DictionaryDescriptorService} from '../core/dictionary-descriptor.service';
import {EosDictionary} from '../core/eos-dictionary';
import {EosDictionaryNode} from '../core/eos-dictionary-node';
import { EosAccessPermissionsService } from 'eos-dictionaries/services/eos-access-permissions.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';

@Component({
    selector: 'eos-department-node-info',
    templateUrl: 'department-node-info.component.html',
})
export class DepartmentNodeInfoComponent extends BaseNodeInfoComponent implements OnChanges {
    public photo;
    public update: boolean;
    public roles = ROLES_IN_WORKFLOW;
    createUserModal: BsModalRef;

    boss: EosDictionaryNode;
    department: string;

    constructor(
        private _modalSrv: BsModalService,
        private _descrSrv: DictionaryDescriptorService,
        private _eaps: EosAccessPermissionsService,
        private _msgSrv: EosMessageService,
    ) {
        super();
    }

    ngOnChanges() {
        super.ngOnChanges();

        this.boss = null;
        if (this.node) {
            if ((!this.node.data.rec['IS_NODE']) && (this.node.children)) {
                const dict = new EosDictionary('departments', this._descrSrv);
                dict.descriptor.getBoss(this.node.id)
                    .then((boss) => {
                        if (boss) {
                            this.boss = new EosDictionaryNode(dict, boss);
                        }
                    });
            } else {
                if (this.node.parent) {
                    this.department = this.node.parent.getParentData('FULLNAME', 'rec') ||
                        this.node.parent.getParentData('CLASSIF_NAME', 'rec');
                    if (this.node.data.photo && this.node.data.photo.url) {
                        this.photo = this.node.data.photo.url;
                    } else {
                        this.photo = null;
                    }
                }
            }
        }
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
        if (this._eaps.isAccessGrantedForUsers()) {
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

    private fioTogin(text: string) {
        return this.toTranslit(text.replace(/ /g, '').replace(/-/g, '').replace(/\./g, '').slice(0, 12));
    }
}
