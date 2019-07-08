import {Component, Output, EventEmitter, Input, OnChanges, OnDestroy} from '@angular/core';
import { EosDesk } from '../core/eos-desk';
import {DEFAULT_DESKS, EosDeskService} from '../services/eos-desk.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { WARN_DESK_EDITING, WARN_DESK_CREATING, DANGER_DESK_CREATING } from '../consts/messages.consts';
import { CONFIRM_DESK_DELETE } from '../consts/confirms.const';
import { NgForm } from '@angular/forms';
import { EosUtils } from 'eos-common/core/utils';
import {Subscription} from 'rxjs';


@Component({
    selector: 'eos-desktop-list',
    templateUrl: './desktop-list.component.html'
})
export class DesktopListComponent implements OnChanges, OnDestroy {
    @Input() selectedMarker = true;
    @Input() hideSystem = false;

    @Output() onSelectDesk: EventEmitter<EosDesk> = new EventEmitter<EosDesk>();

    inputTooltip: any = {
        visible: false,
        message: '',
        placement: 'bottom',
        class: 'tooltip-error',
        container: ''
    };

    deskList: EosDesk[] = [];
    selectedDesk: EosDesk;
    deskName: string;
    creating = false;
    editing = false;
    updating = false;
    focused = false;
    maxLength = 80;
    showCheck = true;
    innerClick: boolean;

    private list: EosDesk[] = [];

    private _desksListSubscription: Subscription;
    private _selectedDeskSubscription: Subscription;

    constructor(
        private _deskSrv: EosDeskService,
        private _msgSrv: EosMessageService,
        private _confirmSrv: ConfirmWindowService,
    ) {
        this.deskList = DEFAULT_DESKS;
        this.selectedDesk = DEFAULT_DESKS[0];
        this._desksListSubscription = this._deskSrv.desksList.subscribe((res) => {
            this.list = EosUtils.deepUpdate([], res);
            this.ngOnChanges();
        });
        this._selectedDeskSubscription = this._deskSrv.selectedDesk.subscribe((desk) =>
            setTimeout(() => this.selectedDesk = desk, 0));
    }

    ngOnChanges() {
        this.deskList = this.list.filter((desk) => !this.hideSystem || desk.id !== 'system');
    }

    ngOnDestroy(): void {
        this._desksListSubscription.unsubscribe();
        this._selectedDeskSubscription.unsubscribe();
    }

    openEditForm(evt: Event, desk: EosDesk) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.updating) {
            return;
        }
        if (this._moreThenOneEdited()) {
            this._msgSrv.addNewMessage(WARN_DESK_EDITING);
        } else {
            desk.edited = true;
            this.deskName = desk.name;
            this.editing = true;
        }
    }

    openCreateForm(evt: Event) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.updating) {
            return;
        }
        if (this._moreThenOneEdited() && !this.creating) {
            this._msgSrv.addNewMessage(WARN_DESK_CREATING);
        } else if (!this.creating) {
            this.creating = true;
            this.deskName = this._deskSrv.generateNewDeskName();
        }
    }

    saveDesk($evt: Event): void {
        $evt.stopPropagation();
        const findDesk = this._deskSrv.desktopExisted(this.deskName);
        let desk = this.deskList.find((d) => d.edited);

        if (!desk) {
            desk = {
                id: null,
                name: this.deskName,
                references: [],
                edited: false,
            };
        }
        if (findDesk && desk && findDesk.id !== desk.id) {
            this._msgSrv.addNewMessage(DANGER_DESK_CREATING);
        } else {
            this.updating = true;
            let pUpdate: Promise<any>;
            desk.edited = false;
            desk.name = this.deskName.trim();
            if (desk.id) {
                pUpdate = this._deskSrv.editDesk(desk);
            } else {
                pUpdate = this._deskSrv.createDesk(desk);
            }
            pUpdate.then(() => {
                this.updating = false;
                this.editing = false;
                this.creating = false;
                this.deskName = '';
            });
        }
    }

    cancelEdit($evt: Event) {
        $evt.stopPropagation();
        const desk = this.deskList.find((d) => d.edited);
        if (desk) {
            desk.edited = false;
        }
        this.editing = false;
        this.creating = false;
    }

    removeDesk(desk: EosDesk, $evt: Event): void {
        $evt.stopPropagation();
        const _confrm = Object.assign({}, CONFIRM_DESK_DELETE);
        _confrm.body = _confrm.body.replace('{{name}}', desk.name);

        this.updating = true;
        this._confirmSrv
            .confirm(_confrm)
            .then((confirmed: boolean) => {
                if (confirmed) {
                    return this._deskSrv.removeDesk(desk);
                }
            })
            .then(() => {
                this.updating = false;
            });
    }

    selectDesk(desk: EosDesk, evt: Event): void {
        if (!this.editing && !this.creating) {
            this.onSelectDesk.emit(desk);
        } else {
            evt.stopPropagation();
        }
    }

    onFocus() {
        this.inputTooltip.visible = false;
    }

    onBlur(form: NgForm) {
        const control = form.controls['deskName'];
        if (control) {
            this.inputTooltip.message = EosUtils.getControlErrorMessage(control, { maxLength: 80 });
            this.inputTooltip.visible = control && control.dirty && control.invalid;
        }
    }

    private _moreThenOneEdited(): boolean {
        if (this.creating) {
            return true;
        } else {
            let edited = 0;
            this.deskList.forEach((desk) => {
                if (desk.edited) {
                    edited++;
                }
            });
            return edited > 0;
        }
    }
}
