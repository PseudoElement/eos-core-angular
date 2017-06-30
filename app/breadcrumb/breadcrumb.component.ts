import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';
import 'rxjs/add/operator/filter';

import { EosDictService } from '../services/eos-dict.service';

interface IBreadcrumb {
    url: string;
    title: string;
    params?: any;
}

@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
})
export class BreadcrumbsComponent {
    breadcrumbs: IBreadcrumb[];
    private _dictionaryBc: IBreadcrumb;
    dictionariesList: Array<{ id: string, title: string }>;

    constructor(private _router: Router, private _dictionaryService: EosDictService) {
        _router.events
            .filter((e) => e instanceof RoutesRecognized)
            .subscribe((e) => this._update(e));
        _dictionaryService.dictionariesList$
            .subscribe((dictionariesList) => this.dictionariesList = dictionariesList);
        this.dictionariesList = [];
    }

    private _update(evt: any) {
        let currentUrlPart = evt.state._root;
        let currUrl = '';

        this.breadcrumbs = [{
            url: '/home',
            title: 'Home',
            params: new Object(),
        }];

        while (currentUrlPart.children.length > 0) {
            currentUrlPart = currentUrlPart.children[0];
            const routeSnaphot = currentUrlPart.value as ActivatedRouteSnapshot;
            const subpath = routeSnaphot.url.map((item) => item.path).join('/');

            if (subpath && subpath !== 'home') {
                currUrl += '/' + subpath;
                let bc: IBreadcrumb = {
                    title: routeSnaphot.data.title,
                    url: currUrl,
                    params: routeSnaphot.params,
                };

                if (routeSnaphot.params && routeSnaphot.params.dictionaryId) {
                    this._dictionaryBc = bc;
                    this._dictionaryService.getDictionariesList()
                    .then((list) => {
                        let _d = list.find((e:any)=> e.id === routeSnaphot.params.dictionaryId);
                        if (_d) {
                            this._dictionaryBc.title = _d.title;
                        }
                    });
                }
                /*
                if (routeSnaphot.data.isDictionary && this.dictionariesList) {
                    for (let i in this.dictionariesList) {
                        if (this.dictionariesList[i].id === routeSnaphot.params.dictionaryId) {
                            title = this.dictionariesList[i].title;
                            break;
                        }
                    }
                }
                */
                this.breadcrumbs.push(bc);
            }
        }
        /* console.log('breadcrumbs', this.breadcrumbs); */
    }
}
