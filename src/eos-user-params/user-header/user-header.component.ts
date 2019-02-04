import {Component, Input, Output, EventEmitter} from '@angular/core';


@Component({
    selector: 'eos-user-params-header',
    styleUrls: ['user-header.component.scss'],
    templateUrl: 'user-header.component.html'

})
export class UserHeaderComponent {
    editMode: boolean = false;
    @Input() title: string;
    @Input() link: string;
    @Output() submitEmit = new EventEmitter<any>();
    @Output() cancelEmit = new EventEmitter<any>();
    constructor () {

    }

    cancel() {
        this.editMode = false;
        this.cancelEmit.emit('');
    }
    submit() {
        this.submitEmit.emit('');
    }
    edit() {
        this.editMode = !this.editMode;
    }

    close() {
        this.editMode = false;
    }




}
