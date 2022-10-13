import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavParamService } from 'app/services/nav-param.service';
import { FonTasksService } from 'eos-backgraund-tasks/services/fon-tasks.service';

@Component({
  selector: 'eos-eos-backgraund-single',
  templateUrl: './eos-backgraund-single.component.html',
  styleUrls: ['./eos-backgraund-single.component.scss']
})
export class EosBackgraundSingleComponent implements OnInit {

  public readonly MOUNT_POINT = 'eos-admin-fon-tasks';
  constructor(private route: ActivatedRoute, private router: Router, private _fonTasks: FonTasksService, private _navSrv: NavParamService) { }


  ngOnInit() {
    setTimeout(() => {
      this._navSrv._subscriBtnTree.next(true);
    });
    this.route.params.subscribe(data => {
      try {
        const id = data['taskId'];
        const currentPlugin = this._fonTasks.getCurrentTaskList(id);
        if (!currentPlugin) {
          this.router.navigate(['./background-tasks']);
          return;
        }
        if (this._fonTasks.loadedPlugins.has(id) && currentPlugin) {
          currentPlugin.render(this.MOUNT_POINT);
          return;
        } else {
          this._fonTasks.loadedPlugins.add(id);
          currentPlugin.loadPlugin(this.MOUNT_POINT).then(() => {
            currentPlugin.render(this.MOUNT_POINT);
          });
        }
      } catch (error) {
        console.log('Ошибка при загрузке', error);
      }
    });
  }
}
