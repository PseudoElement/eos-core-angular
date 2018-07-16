import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { ru } from 'ngx-bootstrap/locale';
defineLocale('ru', ru);

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

/* components */
import { ConfirmWindowComponent } from './confirm-window/confirm-window.component';
import { DynamicInputComponent } from './dynamic-form-input/dynamic-input.component';
import { DynamicInputButtonsComponent } from './dynamic-form-input/dynamic-input-buttons.component';
import { DynamicInputCheckboxComponent } from './dynamic-form-input/dynamic-input-checkbox.component';
import { DynamicInputDateComponent } from './dynamic-form-input/dynamic-input-date.component';
import { DynamicInputSelectComponent } from './dynamic-form-input/dynamic-input-select.component';
import { DynamicInputStringComponent } from './dynamic-form-input/dynamic-input-string.component';
import { DynamicInputTextComponent } from './dynamic-form-input/dynamic-input-text.component';
import { DynamicInputToggleComponent } from './dynamic-form-input/dynamic-input-toggle.component';
import { InfoComponent } from './info/info.component';
import { MessagesComponent } from './messages/messages.component';
import { PhotoUploaderComponent } from './photo-uploader/photo-uploader.component';
import { SpinnerComponent } from './spinner/spinner.component';

/* services */
import { ConfirmWindowService } from './confirm-window/confirm-window.service';
import { EosMessageService } from './services/eos-message.service';
import { InputControlService } from './services/input-control.service';

/* directives */
import { EosDateMaskDirective } from './directives/date-mask.directive';
import { InputCleanerDirective } from './input-cleaner/input-cleaner.directive';
import { UnicValidatorDirective } from './directives/unic-validator.directive';

/* pipes */
import { EosDatePipe } from './pipes/eos-date.pipe';

@NgModule({
    declarations: [
        ConfirmWindowComponent,
        InfoComponent,
        MessagesComponent,
        InputCleanerDirective,
        SpinnerComponent,
        PhotoUploaderComponent,
        UnicValidatorDirective,
        DynamicInputComponent,
        DynamicInputButtonsComponent,
        DynamicInputCheckboxComponent,
        DynamicInputDateComponent,
        DynamicInputSelectComponent,
        DynamicInputStringComponent,
        DynamicInputTextComponent,
        DynamicInputToggleComponent,
        EosDateMaskDirective,
        EosDatePipe,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        AlertModule.forRoot(),
        ModalModule.forRoot(),
    ],
    exports: [
        ConfirmWindowComponent,
        InfoComponent,
        MessagesComponent,
        InputCleanerDirective,
        SpinnerComponent,
        PhotoUploaderComponent,
        UnicValidatorDirective,
        DynamicInputComponent,
        EosDatePipe,
    ],
    entryComponents: [
        ConfirmWindowComponent,
    ],
    providers: [
        ConfirmWindowService,
        EosMessageService,
        InputControlService,
    ]
})
export class EosCommonModule { }
