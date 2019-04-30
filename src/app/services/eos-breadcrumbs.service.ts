import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { BehaviorSubject ,  Observable ,  Subject } from 'rxjs';
import { filter } from 'rxjs/operators';


import { IBreadcrumb } from '../core/breadcrumb.interface';
import { IDeskItem } from '../core/desk-item.interface';
import { DictionaryDescriptorService } from 'eos-dictionaries/core/dictionary-descriptor.service';
import { IActionEvent } from 'eos-dictionaries/interfaces';

@Injectable()
export class EosBreadcrumbsService {
    public _eventFromBc$: Subject<IActionEvent>;
    private _breadcrumbs: IBreadcrumb[];
    private _currentLink: IDeskItem;
    private _breadcrumbs$: BehaviorSubject<IBreadcrumb[]>;

    get breadcrumbs$(): Observable<IBreadcrumb[]> {
        return this._breadcrumbs$.asObservable();
    }

    get breadcrumbs() {
        return this._breadcrumbs;
    }

    get currentLink() {
        return this._currentLink;
    }

    constructor(
        _router: Router,
        private _route: ActivatedRoute,
        private dictDescriptorSrv: DictionaryDescriptorService,
    ) {
        this._breadcrumbs$ = new BehaviorSubject<IBreadcrumb[]>([]);
        this._eventFromBc$ = new Subject();
        this.makeBreadCrumbs();
        _router.events
        .pipe(
            filter((e: NavigationEnd) => e instanceof NavigationEnd)
        )
            .subscribe(() => this.makeBreadCrumbs());
    }

    public sendAction(action: IActionEvent) {
        this._eventFromBc$.next(action);
    }

    private makeBreadCrumbs() {
        this._breadcrumbs = [];
        const breadcrumbs = this._parseState(this._route.snapshot);
        // 55: Убрать без title (!?) routing -> showInBreadcrubs
        this._breadcrumbs = this._breadcrumbs.concat(breadcrumbs.filter((bc) => bc && !!bc.title));
        /* this._fullTitleGen(); */
        if (this._breadcrumbs.length) {
            this._currentLink = {
                url: this._breadcrumbs[this._breadcrumbs.length - 1].url,
                title: this._breadcrumbs[this._breadcrumbs.length - 1].title,
                /* fullTitle: this._breadcrumbs[this._breadcrumbs.length - 1].fullTitle */
            };
        }
        this._breadcrumbs$.next(this._breadcrumbs);
    }

    private _parseState(route: ActivatedRouteSnapshot): IBreadcrumb[] {
        let currUrl = '';
        let _current = route;
        const crumbs: IBreadcrumb[] = [];

        while (_current) {
            const subpath = _current.url.map((item) => item.path).join('/');
            if (subpath && _current.data && _current.data.showInBreadcrumb) {
                currUrl += '/' + subpath;
                const bc: IBreadcrumb = {
                    title: _current.data.title,
                    url: currUrl,
                    params: _current.params,
                };

                if (_current.params) {
                    if (_current.params.dictionaryId && !_current.params.nodeId) {
                        const _dictId = _current.params.dictionaryId;
                        let descr = this.dictDescriptorSrv.getDescriptorClass(_dictId);
                        if (descr) {
                            bc.title = descr.title;
                        }

                        if (descr.getParentDictionaryId()) {
                            descr = this.dictDescriptorSrv.getDescriptorClass(descr.getParentDictionaryId());
                            crumbs.push({
                                title: descr.title,
                                url: '/spravochniki/' + descr.id
                            });
                        }
                    }
                }
                crumbs.push(bc);
            }
            _current = _current.firstChild;
        }

        return crumbs;
    }
}
