import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { IMessage } from '../../eos-common/core/message.interface';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'eos-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
    public authMsg: string;
    private _returnUrl: string;
    private _subscription: Subscription;

    constructor(
        private _msgSrv: EosMessageService,
        private _router: Router,
        private _route: ActivatedRoute,
    ) {
        this._subscription = this._msgSrv.messages$.subscribe((messages: IMessage[]) => {
            const _i = messages.length - 1;
            if (messages.length && messages[_i].authMsg) {
                this.authMsg = messages[_i].title;
            } else {
                this.authMsg = null;
            }
        });
     }

    ngOnInit() {
        this._returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    loggedIn(success: boolean) {
        if (success) {
            if (this._returnUrl.indexOf('?') === -1) {
                this._router.navigate([this._returnUrl]);
            } else {
                const arr = this._returnUrl.split('?');
                const params = this._parseQueryUrl(arr[1]);
                this._router.navigate([arr[0]],
                    {
                        queryParams: params
                    }
                );
            }
        }
    }
    private _parseQueryUrl(query: string) {
        const q = {};
        const arr = query.split('&');
        arr.forEach(i => {
            const a = i.split('=');
            q[a[0]] = a[1];
        });
        return q;
    }
}
