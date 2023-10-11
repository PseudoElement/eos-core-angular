import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavParamService } from '../../../app/services/nav-param.service';
import { FonTasksService } from '../../../eos-backgraund-tasks/services/fon-tasks.service';

@Component({
    selector: 'eos-eos-background-single',
    templateUrl: './eos-backgraund-single.component.html',
    styleUrls: ['./eos-backgraund-single.component.scss']
})
export class EosBackgroundSingleComponent implements OnInit {

    public readonly MOUNT_POINT = 'eos-admin-fon-tasks';
    // private readonly _deletedStyleIds = [
    //     "daemonsManager-style",
    //     "SmevPluginSettings-style",
    //     "SevPluginSettings-style",
    //     "DiadocPluginSettings-style",
    //     "DUEPluginSettings-style",
    //     "LckFilesPluginSettings-style",
    //     "PrepareDocumentToSendPluginSettings-style",
    //     "GUpdatePluginSettings-style",
    //     "SfrPluginSettings-style",
    // ]
    constructor(private route: ActivatedRoute, private router: Router, private _fonTasks: FonTasksService, private _navSrv: NavParamService) { }


    ngOnInit() {
        setTimeout(() => {
            this._navSrv._subscriBtnTree.next(true);
        });
        this.route.params.subscribe(data => {
            try {
                const id = data['taskId'] || this._fonTasks.saveTaskId;
                const currentPlugin = this._fonTasks.getCurrentTaskList(id);
                if (!currentPlugin) {
                    this.router.navigate(['./services']);
                    return;
                }
                currentPlugin.render(this.MOUNT_POINT, 'scriptAppend');
                this._fonTasks.saveTaskId = id;
            } catch (error) {
                console.log('Ошибка при загрузке', error);
            }
        });
    }
    // ngOnDestroy(): void {
        // EosUtils.removeUselessStyles('data-styled')
        // this._deletedStyleIds.forEach(value => EosUtils.removeUselessStyles('id', value))
    // }
}
