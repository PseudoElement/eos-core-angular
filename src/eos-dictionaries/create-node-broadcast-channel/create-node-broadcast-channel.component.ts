import {CreateNodeComponent} from '../create-node/create-node.component';
import {Component} from '@angular/core';
import {EosDictService} from '../services/eos-dict.service';
import {EosMessageService} from '../../eos-common/services/eos-message.service';
import {EosDeskService} from '../../app/services/eos-desk.service';
import {EosDepartmentsService} from '../services/eos-department-service';
import {EosBreadcrumbsService} from '../../app/services/eos-breadcrumbs.service';
import {EosBroadcastChannelService} from '../services/eos-broadcast-channel.service';

@Component({
    selector: 'eos-create-node-broadcast-channel',
    templateUrl: 'create-node-broadcast-channel.component.html',
})

export class CreateNodeBroadcastChannelComponent extends CreateNodeComponent {

    constructor(
        protected _deskSrv: EosDeskService,
        protected _dictSrv: EosDictService,
        protected _breadcrumbsSrv: EosBreadcrumbsService,
        protected _msgSrv: EosMessageService,
        protected _channelSrv: EosBroadcastChannelService,
        departmentsSrv: EosDepartmentsService,
    ) {
        super(_deskSrv, _dictSrv, _breadcrumbsSrv, _msgSrv, departmentsSrv);
    }

    public create(hide = true) {
        this.upadating = true;
        const data = this.cardEditRef.getNewData();
        this._channelSrv.data = data.rec;
        data.rec['PARAMS'] = this._channelSrv.toXml();
        const props = ['CLASSIF_NAME', 'NOTE', 'CHANNEL_TYPE', 'PARAMS'];

        for (const prop in data.rec) {
            if (data.rec.hasOwnProperty(prop) && !props.includes(prop)) {
                delete data.rec[prop];
            }
        }
        Object.assign(data.rec, this.nodeData.rec); // update with predefined data

        this._sendDataOnCreate(data, hide);
    }

}
