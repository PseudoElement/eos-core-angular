import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Renderer2, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParamService } from 'app/services/nav-param.service';
import { AppContext } from 'eos-rest/services/appContext.service';

@Component({
    selector: 'eos-plugin-react',
    templateUrl: './plugin-react.component.html',
    styleUrls: ['./plugin-react.component.scss'],
})
export class PluginReactComponent implements OnInit, AfterViewInit, OnDestroy {
    scriptsUrl: any;

    constructor(private sanitizer: DomSanitizer, private render: Renderer2, @Inject(DOCUMENT) private document: Document, private _navSrv: NavParamService, private appCtx: AppContext) {
      window['uisn'] = this.appCtx.CurrentUser.ISN_LCLASSIF;
    }

    ngOnInit() {
      setTimeout(() => {
        this._navSrv._subscriBtnTree.next(true);
      });
    }
    ngAfterViewInit(): void {
      this.scriptsUrl = this.sanitizer.sanitize(SecurityContext.URL, '../UserSessionPlugin/load-plugin-nocache.js');
      const script = this.render.createElement('script');
      script.src = this.scriptsUrl;
      script.async = true;
      const div_placer = this.document.getElementById('plugins_place_session');
      this.render.appendChild(div_placer, script);
    }

    ngOnDestroy(): void {
      const div_placer = this.document.getElementById('plugins_place_session');
      const header = this.document.getElementsByTagName('head');
      if (header[0]) {
        if (/\.App/.test(header[0].lastChild.textContent)) {
            header[0].removeChild(header[0].lastChild);
        }

      }
      if (div_placer.firstChild) {
        div_placer.removeChild(div_placer.firstChild);
        div_placer.removeChild(div_placer.lastChild);
      }
    }
}
