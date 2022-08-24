import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, /* Router */ } from '@angular/router';
import { NavParamService } from 'app/services/nav-param.service';


@Component({
  selector: 'eos-instruments-single',
  templateUrl: './eos-instruments-single.component.html',
  styleUrls: ['./eos-instruments-single.component.scss']
})
export class EosInstrumentsSingleComponent implements OnInit {

  public readonly MOUNT_POINT = 'eos-admin-instruments';
  constructor(private route: ActivatedRoute, /* private router: Router, */ private _navSrv: NavParamService) { }


  ngOnInit() {
    setTimeout(() => {
      this._navSrv._subscriBtnTree.next(true);
    });
    this.route.params.subscribe(data => {
     // const id = data['taskId'];
      // const currentPlugin = this._fonTasks.getCurrentTaskList(id);
      // if (!currentPlugin) {
      //   this.router.navigate(['./instruments']);
      //   return;
      // }
      // if (this._fonTasks.loadedPlugins.has(id) && currentPlugin) {
      //   currentPlugin.render(this.MOUNT_POINT);

      //   return;
      // } else {
      //   this._fonTasks.loadedPlugins.add(id);
      //   currentPlugin.loadPlugin(this.MOUNT_POINT).then(() => {
      //     currentPlugin.render(this.MOUNT_POINT);
      //   });
      // }
    });
  }
}
