import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { NavParamService } from 'app/services/nav-param.service';
import { AppContext } from 'eos-rest/services/appContext.service';

@Component({
    selector: 'eos-plugin-react',
    templateUrl: './plugin-react.component.html',
    styleUrls: ['./plugin-react.component.scss'],
})
export class PluginReactComponent implements OnInit, AfterViewInit, OnDestroy {
    scriptsUrl: any;

    constructor( @Inject(DOCUMENT) private document: Document, private _navSrv: NavParamService, private appCtx: AppContext) {
      window['uisn'] = this.appCtx.CurrentUser.ISN_LCLASSIF;
    }

    ngOnInit() {
      setTimeout(() => {
        this._navSrv._subscriBtnTree.next(true);
      });
    }
    ngAfterViewInit(): void {
      const w: any = window;
      if (w.pluginManager && w.pluginManager.loadPlugins) {
          w.pluginManager.loadPlugins();
      }
    }

    ngOnDestroy(): void {
      const header = this.document.getElementsByTagName('head');
      if (header[0]) {
        if (/\.App/.test(header[0].lastChild.textContent)) {
            header[0].removeChild(header[0].lastChild);
        }
      }
    }
}
