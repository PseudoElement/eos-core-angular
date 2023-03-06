import { Component } from '@angular/core';

import { EosNoticeService } from '../services/eos-notice.service';

@Component({
    selector: 'eos-notice',
    templateUrl: 'notice.component.html',
})
export class NoticeComponent {
    noticesCount = 0;
    notices: string[];

    constructor(private _noticeSrv: EosNoticeService) {
        this.noticesCount = this._noticeSrv.noticesCount;
        this.notices = this._noticeSrv.notices;
    }
}
