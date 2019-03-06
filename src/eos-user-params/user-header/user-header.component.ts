import {Component, Input, Output, EventEmitter} from '@angular/core';


@Component({
    selector: 'eos-user-params-header',
    styleUrls: ['user-header.component.scss'],
    templateUrl: 'user-header.component.html'
})
export class UserHeaderComponent {
    editMode: boolean = false;
    @Input() title: string;
    @Input() link: string; // ISN USER_CL
    @Input() disableBtn: boolean;
    @Input() selfLink: string;
    @Input() defaultBtn?: boolean;
    @Output() defaultEmit = new EventEmitter<any>();
    @Output() submitEmit = new EventEmitter<any>();
    @Output() cancelEmit = new EventEmitter<boolean>();
    @Output() editEmit = new EventEmitter<boolean>();
    @Output() closeEmit = new EventEmitter<boolean>();
    constructor () {

    }
    default() {
        this.defaultEmit.emit('');
    }

    cancel() {
        this.editMode = false;
        this.cancelEmit.emit(false);
    }
    submit() {
        this.submitEmit.emit('');
    }
    edit() {
        this.editMode = !this.editMode;
        this.editEmit.emit( this.editMode);
    }
    close() {
        this.editMode = false;
        this.closeEmit.emit(false);

    }




}
