import { Component, Injector } from '@angular/core';
import { EosCommonOverriveService } from '../../app/services/eos-common-overrive.service';
import { BaseCardEditDirective } from '../../eos-dictionaries/card-views/base-card-edit.component';

@Component({
  selector: 'lib-eos-common-dynamic',
  templateUrl: "./eos-common-dynamic.component.html",
})

export class EosCommonDynamicComponent extends BaseCardEditDirective {
  template: any[];
  constructor(injector: Injector, private _eosCommonOverride: EosCommonOverriveService) {
    super(injector);
  }

  ngOnInit(): void {
    this.template = this._eosCommonOverride.controlsEditCard;
  }
  ngAfterViewInit() {

  }

}
