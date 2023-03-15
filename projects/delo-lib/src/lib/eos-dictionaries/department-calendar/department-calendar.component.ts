import {Component, Output, EventEmitter} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';



@Component({
    selector: 'eos-department-calendar',
    templateUrl: 'department-calendar.component.html',
})

export class DepartmentCalendarComponent {
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    isUpdating = true;
    public due: string;
    private _departmentTitle: string = '';
    private _hasChanges: boolean;

    constructor(
        public bsModalRef: BsModalRef,
    ) {
        this.isUpdating = true;
    }

    public init(due: string, departmentTitle: string) {
        this.isUpdating = true;
        this.due = due;
        this._departmentTitle = departmentTitle;
        this._hasChanges = false;

        this.isUpdating = false;
    }

    public getNodeTitle(): string {
        return this._departmentTitle;
    }

    public getTitleLabel(): string {
        return 'Подразделения - календарь';
    }

    public hideModal(): void {
        this.onClose.emit(this._hasChanges);
        this.bsModalRef.hide();
    }

    public onSaveChanges($event?) {
        this._hasChanges = true;
    }

}
