import {Component, OnChanges} from '@angular/core';
import {DEFAULT_PHOTO} from 'eos-dictionaries/consts/common';
import {BaseNodeInfoComponent} from './base-node-info';
import {ROLES_IN_WORKFLOW} from '../consts/dictionaries/department.consts';
import {EosDictionaryNode} from '../core/eos-dictionary-node';
import {CreateUserComponent} from '../../eos-user-select/list-user-select/createUser/createUser.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {UserParamApiSrv} from '../../eos-user-params/shared/services/user-params-api.service';

@Component({
    selector: 'eos-department-node-info',
    templateUrl: 'department-node-info.component.html',
})
export class DepartmentNodeInfoComponent extends BaseNodeInfoComponent implements OnChanges {
    public photo = DEFAULT_PHOTO;
    public update: boolean;
    public roles = ROLES_IN_WORKFLOW;
    createUserModal: BsModalRef;

    boss: EosDictionaryNode;
    department: string;

    constructor(
        private _modalSrv: BsModalService,
        private _uapisrv: UserParamApiSrv,
    ) {
        super();
    }

    ngOnChanges() {
        super.ngOnChanges();

        if (this.node) {
            this._uapisrv.getUsers(this.node.data.rec['DUE']).then((u) => {
                this.nodeDataFull.user = u[0];
            });

            if (!this.node.data.rec['IS_NODE'] && this.node.children) {
                this.boss = this.node.children.find((_chld) => _chld.data.rec['POST_H']);
            } else {
                if (this.node.parent) {
                    this.department = this.node.parent.getParentData('FULLNAME', 'rec') ||
                        this.node.parent.getParentData('CLASSIF_NAME', 'rec');
                    if (this.node.data.photo && this.node.data.photo.url) {
                        this.photo = this.node.data.photo.url;
                    } else {
                        this.photo = DEFAULT_PHOTO;
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
        this.createUserModal = this._modalSrv.show(CreateUserComponent, {
            class: 'param-create-user',
            ignoreBackdropClick: true,
        });
        this.createUserModal.content.initDue = this.node.data.rec['DUE'];
        this.createUserModal.content.initLogin = this.fioTogin(this.node.data.rec['CLASSIF_NAME']);
        this.createUserModal.content.closedModal.subscribe(() => {
            this.createUserModal.hide();
        });
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

    private fioTogin(text: string) {
        return this.toTranslit(text.replace(/ /g, '').replace(/-/g, '').replace(/\./g, '').slice(0, 12));
    }
}
