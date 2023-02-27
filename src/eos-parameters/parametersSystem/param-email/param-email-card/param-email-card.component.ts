/* import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service'; */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/* import { RUBRICATOR_DICT } from 'eos-dictionaries/consts/dictionaries/rubricator.consts'; */

@Component({
    selector: 'eos-param-email-card',
    templateUrl: 'param-email-card.component.html',
    styleUrls: ['./param-email-card.component.scss']

})
export class ParamEmailCardComponent implements OnInit {
    @Input() form;
    @Input() inputs;
    @Input() dataProfile;
    @Output() submitEmit = new EventEmitter();
    @Output() cancelEmit = new EventEmitter();
    public data = {
        ProfileName: ''
    };
    public title = 'Редактирование профиля электронной почты';
    ngOnInit(): void {
        console.log('test', this.dataProfile);
    }
    cancel() {
        this.cancelEmit.next();
    }
    submit() {
        this.submitEmit.next();
    }
}
