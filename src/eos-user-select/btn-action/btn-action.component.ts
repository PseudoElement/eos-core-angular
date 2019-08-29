import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {BtnAction, BtnActionFields} from '../shered/interfaces/btn-action.interfase';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-message.service';
@Component({
    selector: 'eos-btn-action',
    templateUrl: 'btn-action.component.html',
    styleUrls: ['btn-action.component.scss'],
})

export class BtnActionComponent implements OnInit {

    @Input() buttons: BtnAction;
    @Output() showAction: EventEmitter<any> = new EventEmitter<any>();

    tooltipDelay = TOOLTIP_DELAY_VALUE;

    constructor() {
    }
    ngOnInit() {
    }
    doAction(event, dropdown) {
        if (dropdown) {
            dropdown.hide();
        }
        this.changeButtons(event);
        this.showAction.emit(event);
    }

    changeButtons(name) {
        // в this.buttons.buttons и  this.buttons.moreButtons  ссылки на одни и те же массивы
      this.buttons.buttons.map((button: BtnActionFields) => {
          if (button.name === name) {
              button.isActive = !button.isActive;
          }
          return button;
        });

        this.buttons.moreButtons.map((button: BtnActionFields) => {
            if (button.name === name) {
                button.isActive = !button.isActive;
            }
            return button;
          });
    }
}
