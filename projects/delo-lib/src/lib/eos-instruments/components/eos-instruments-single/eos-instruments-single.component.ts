import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, /* Router */ } from '@angular/router';
import { NavParamService } from '../../../app/services/nav-param.service';
import { EosAdmToolsService } from '../../../eos-instruments/services/EosAdmTools.service';


@Component({
  selector: 'eos-instruments-single',
  templateUrl: './eos-instruments-single.component.html',
  styleUrls: ['./eos-instruments-single.component.scss']
})
export class EosInstrumentsSingleComponent implements OnInit {

  public readonly MOUNT_POINT = 'eos-admin-tools';
  // private readonly _deletedStyleIds = ['printFormPlugin-style', 'manage-reports-style', 'ProcessConstructorPlugin-style'];

  constructor(private route: ActivatedRoute, private router: Router, private _navSrv: NavParamService, private _eosAdmTools: EosAdmToolsService) { }
  ngOnInit() {
    setTimeout(() => {
      this._navSrv._subscriBtnTree.next(true);
    });
    this.route.params.subscribe(data => {
      try {
        const id = data['taskId'] || this._eosAdmTools.saveTaskId;
        const currentPlugin = this._eosAdmTools.getCurrentTaskList(id);
        if (!currentPlugin) {
          this.router.navigate(['./instruments']);
          return;
        }
        currentPlugin.render(this.MOUNT_POINT, 'scriptAppend');
        this._eosAdmTools.saveTaskId = id;
      } catch (error) {
        console.log('Ошибка при загрузке', error);
      }
    });
  }
  // ngOnDestroy(): void {
    // EosUtils.removeUselessStyles('data-styled')
    // EosUtils.removeUselessStyles('id', 'index.1-style')
    // this._deletedStyleIds.forEach(value => EosUtils.removeUselessStyles('id', value))
  // }
}
