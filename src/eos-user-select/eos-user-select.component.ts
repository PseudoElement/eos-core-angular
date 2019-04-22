import { Component, OnDestroy, AfterViewInit, DoCheck, ViewChild, HostListener } from '@angular/core';
import { EosSandwichService } from 'eos-dictionaries/services/eos-sandwich.service';
import { Subject } from 'rxjs/Subject';
import { NavParamService } from 'app/services/nav-param.service';
@Component({
    selector: 'eos-user-selector',
    templateUrl: 'eos-user-select.component.html'
})
export class UserSelectComponent implements OnDestroy, AfterViewInit, DoCheck {
    @ViewChild('tree') treeEl;
    currentState: boolean[] = [true, true];
    _treeScrollTop = 0;
    hasParent: boolean = true;
    hideTree = false;
    treeNodes = [1, 2];
    fonConf = {
        width: 0 + 'px',
        height: 0 + 'px',
        top: 0 + 'px'
    };
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private _sandwichSrv: EosSandwichService,
        private _navSrv: NavParamService,
    ) {
        _sandwichSrv.currentDictState$.takeUntil(this.ngUnsubscribe)
            .subscribe((state: boolean[]) => {
                this.currentState = state;
            });
        this._navSrv._subscriBtnTree.next(false);
    }

    ngOnDestroy() {
        // this._sandwichSrv.treeScrollTop = this._treeScrollTop;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngAfterViewInit() {
        this._treeScrollTop = this._sandwichSrv.treeScrollTop;
        this.treeEl.nativeElement.scrollTop = this._treeScrollTop;
    }

    ngDoCheck() {
        this._treeScrollTop = this.treeEl.nativeElement.scrollTop;
    }

    @HostListener('window:resize')
    resize(): void {
        this._sandwichSrv.resize();
    }
    // onClick() {
    //     if (window.innerWidth < 1600) {
    //         this._sandwichSrv.changeDictState(false, true);
    //     }
    // }
    goUp() {
        console.log('goUp()');
    }
}
