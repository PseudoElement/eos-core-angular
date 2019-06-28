import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';

import { AuthService } from '../../eos-rest/services/auth.service';
import { AUTH_REQUIRED, SESSION_CLOSED } from '../consts/messages.consts';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { IUserProfile } from '../core/user-profile.interface';
import { DEFAULT_USER, USER_SETTINGS } from '../consts/user.consts';
import { ISettingsItem } from '../core/settings-item.interface';
import { USER_CL, SYS_PARMS } from '../../eos-rest/interfaces/structures';
import { EosStorageService } from 'app/services/eos-storage.service';

@Injectable()
export class EosUserProfileService implements IUserProfile {
    name: string;
    secondName: string;
    family: string;
    photoUrl?: string;
    settings: ISettingsItem[];
    private _user: USER_CL;
    // private _params: SYS_PARMS;

    private _isAuthorized: boolean;

    private _settings$: BehaviorSubject<ISettingsItem[]>;
    private _authorized$: BehaviorSubject<boolean>;
    private _authPromise: Promise<boolean>;

    get userId(): string {
        if (this._user) {
            return this._user.ISN_LCLASSIF + '';
        } else {
            return 'nobody';
        }
    }

    get shortName(): string {
        if (this._user) {
            return this._user.SURNAME_PATRON;
        } else {
            return null;
        }
    }

    get settings$(): Observable<ISettingsItem[]> {
        return this._settings$.asObservable();
    }

    get authorized$(): Observable<boolean> {
        return this._authorized$.asObservable();
    }

    constructor(
        private _authSrv: AuthService,
        private _msgSrv: EosMessageService,
        private _storageSrv: EosStorageService,
    ) {
        Object.assign(this, DEFAULT_USER);
        this.settings = USER_SETTINGS;
        this._isAuthorized = false;
        this._settings$ = new BehaviorSubject<ISettingsItem[]>(this.settings);
        this._authorized$ = new BehaviorSubject<boolean>(null);
    }

    checkAuth(): Promise<boolean> {
        if (!this._isAuthorized) {
            if (!this._authPromise) {
                this._authPromise = this._authSrv.getContext()
                    .then((context) => {
                        this._setUser(context.user, context.sysParams);
                        this._authPromise = null;
                        return this._setAuth(true);
                    })
                    .catch(() => {
                        this._authPromise = null;
                        return this._setAuth(false);
                    });
            }
            return this._authPromise;
        } else {
            return Promise.resolve(this._isAuthorized);
        }
    }

    isAuthorized(silent = false): boolean {
        if (!silent && !this._isAuthorized) {
            this._msgSrv.addNewMessage(AUTH_REQUIRED);
            // this._authorized$.next(this._isAuthorized);
        }
        return this._isAuthorized;
    }

    notAuthorized(): boolean {
        // console.log('notAuthorized fired');
        this._msgSrv.addNewMessage(AUTH_REQUIRED);
        return this._setAuth(false);
    }

    login(name: string, password: string): Promise<boolean> {
        // console.log('login checking auth');
        return this.checkAuth()
            .then((authorized) => {
                if (authorized) {
                    return authorized;
                } else {
                    // console.log('not authorized: login');
                    return this._authSrv
                        .login(name, password)
                        .then((context) => {
                            if (context.user && context.sysParams) {
                                // console.log('authorized: set context if any');
                                this._setUser(context.user, context.sysParams);
                                return this._setAuth(true);
                            } else {
                                // console.log('authorized, but no context');
                                return this._logout(true);
                            }
                        })
                        .catch((err) => {
                            // console.log('login error');
                            return this._logout(true);
                        });
                }
            })
            .catch((err) => {
                this._msgSrv.addNewMessage({
                    type: 'danger',
                    title: err.message ? err.message : err,
                    msg: '',
                    authMsg: true
                });
                return this._logout(true);
            });
    }

    logout(): Promise<any> {
        // console.log('logout called');
        if (this._isAuthorized) {
            return this._authSrv.logout()
                .then(() => this._logout())
                .catch((err) => {
                    this._msgSrv.addNewMessage({
                        type: 'danger',
                        title: err.message ? err.message : err,
                        msg: '',
                        authMsg: true
                    });
                    return this._logout(true);
                });
        } else {
            // console.log('no authorization');
            return Promise.resolve(true);
        }
    }

    setSetting(key: string, value: any) {
        this._setSetting(key, value);
        // this._settings$.next(this.settings);
        this._settings$.next(this.settings);
    }

    saveSettings(settings: any[]) {
        settings.forEach((item) => this._setSetting(item.id, item.value));
        // this._settings$.next(this.settings);
        this._settings$.next(this.settings);
    }

    private _setUser(user: USER_CL, params: SYS_PARMS) {
        // console.log('_setUser', user, params);
        this._user = user;
        // this._params = params;
        this._storageSrv.init(this.userId);
    }

    private _setAuth(auth: boolean): boolean {
        if (this._isAuthorized !== auth) {
            this._isAuthorized = auth;
            this._authorized$.next(auth);
        } else {
            this._authorized$.next(false);
        }
        return auth;
    }

    private _logout(silent = false) {
        this._user = null;
        // this._params = null;
        this._setAuth(false);
        if (!silent) {
            this._msgSrv.addNewMessage(SESSION_CLOSED);
        }
        return this._setAuth(false);
    }

    private _setSetting(key: string, value: any) {
        let _setting = this.settings.find((item) => item.id === key);
        if (!_setting) {
            _setting = {
                id: key,
                name: key,
                value: value
            };
            this.settings.push(_setting);
        } else {
            _setting.value = value;
        }
    }
}
