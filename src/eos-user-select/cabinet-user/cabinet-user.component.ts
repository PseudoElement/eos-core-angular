import { Component, Input } from '@angular/core';
import { EosStorageService } from 'app/services/eos-storage.service';
import { RECENT_URL } from 'app/consts/common.consts';
import { Router } from '@angular/router';
@Component({
    selector: 'eos-cabinet-user',
    templateUrl: 'cabinet-user.component.html'
})

export class CabinetUserComponent {
    @Input() CabinetInfo;
    constructor(private _storageSrv: EosStorageService, private _router: Router, ) {

    }
    writeRecentUrl() {
        this._storageSrv.setItem(RECENT_URL, this._router.url);
    }
}
