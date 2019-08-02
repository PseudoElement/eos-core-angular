import {Component} from '@angular/core';
import {BaseNodeInfoComponent} from './base-node-info';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { IRelationDef } from 'eos-rest';

@Component({
    selector: 'eos-node-info',
    templateUrl: 'node-info.component.html',
})

export class NodeInfoComponent extends BaseNodeInfoComponent {
// TODO: объеденить  loadRelated и loadOptionsDictionary во что то одно внятное.
    value(key): string {
        if (this.values.hasOwnProperty(key)) {
            return this.values[key];
        }

        let res = this.nodeDataFull.rec[key];

        const field = this.fieldsDescriptionFull.rec[key];

        if ((field.type === E_FIELD_TYPE.select || field.type === E_FIELD_TYPE.buttons )) {
            let f = null;
            if (field.options.length) {
                f = field.options.find((op) => op.value === res);
            }

            if (f) {
                res = f.title;
            } else {
                // TODO: Убрать\модернизировать related и options
                const relations: IRelationDef[] = this.node.dictionary.descriptor.getMetadata().relations;
                const rel: IRelationDef = relations.find( r => r.__type === field.dictionaryId);
                if (rel) {
                    const rec = this.node.data[rel.name];
                    if (rec && rec.length) {
                        res = rec[0]['CLASSIF_NAME'];
                    }
                }
            }
        }
        this.values[key] = res;
        return res;
    }
}
