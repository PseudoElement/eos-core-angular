import { AfterViewInit, Component, OnInit} from '@angular/core';
import { Manager } from '@eos/jsplugins-manager';
import { NavParamService } from '../../app/services/nav-param.service';
import { AppContext } from '../../eos-rest/services/appContext.service';

@Component({
    selector: 'eos-plugin-react',
    templateUrl: './plugin-react.component.html',
    styleUrls: ['./plugin-react.component.scss'],
})
export class PluginReactComponent implements OnInit, AfterViewInit {
    scriptsUrl: any;

    constructor(private _navSrv: NavParamService, private appCtx: AppContext) {
      window['uisn'] = this.appCtx.CurrentUser.ISN_LCLASSIF;
    }

    ngOnInit() {
      setTimeout(() => {
        this._navSrv._subscriBtnTree.next(true);
      });
    }
    ngAfterViewInit(): void {
      Manager.loadPlugins({targets: ['UserSessions'], mountPoint: 'user_session_plug_1'}).then(() => {
        console.log('loaded userSession');
      });
    }

    // ngOnDestroy(): void {
      // EosUtils.removeUselessStyles('data-styled')
      // EosUtils.removeUselessStyles('id', 'UserSessions-style')
      // const head = this.document.querySelector('head');
      // if (head && /\.App/.test(head.lastChild.textContent)) head.removeChild(head.lastChild);
    // }
}
