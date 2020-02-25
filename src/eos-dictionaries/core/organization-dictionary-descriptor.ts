import { IRecordOperationResult } from 'eos-dictionaries/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { CONTACT, ORGANIZ_CL, SEV_ASSOCIATION, ADDR_CATEGORY_CL } from 'eos-rest';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { TreeDictionaryDescriptor } from './tree-dictionary-descriptor';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosDictionaryNode } from './eos-dictionary-node';
import { EosUtils } from 'eos-common/core/utils';

const inheritFiields = [
    'ISN_ADDR_CATEGORY',
];

export class OrganizationDictionaryDescriptor extends TreeDictionaryDescriptor {

    getNewRecord(preSetData: {}, parentNode: EosDictionaryNode): {} {
        const newPreset = {};
        EosUtils.deepUpdate(newPreset, preSetData);
        if (parentNode) {
            [
                ... inheritFiields,
            ]
            .forEach((f) => this.fillParentField(newPreset, parentNode.data, f));
        }
        return super.getNewRecord(newPreset, parentNode);
    }

    getRoot(): Promise<any[]> {
        return this.getData({ criteries: { IS_NODE: '0', DUE: '0%', LAYER: '0:2' } }, 'WEIGHT');
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

        const req = { [this.apiInstance]: query };

        if (limit) {
            req.top = limit;
        }

        if (order) {
            req.orderby = order;
        }
        // if (this.id === 'organization') {
        // req.expand = 'CONTACT_List';
        // }
        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                this.prepareForEdit(data);
                return data;
            });
    }

    addContacts(newContacts: any[], orgDUE: string): Promise<IRecordOperationResult[]> {
        return this.apiSrv.read<ORGANIZ_CL>({ ORGANIZ_CL: orgDUE, expand: 'CONTACT_List' })
            .then(([org]) => {
                const results: IRecordOperationResult[] = [];
                if (org) {
                    // console.log('adding contacts to organizaztion', org);
                    this.apiSrv.entityHelper.prepareForEdit(org);
                    const contacts = org.CONTACT_List || [];
                    newContacts.forEach((contact) => {
                        const existContact = contacts.find((exContact) =>
                            exContact['SURNAME'] === contact['SURNAME'] &&
                            exContact['DUTY'] === contact['DUTY'] &&
                            exContact['DEPARTMENT'] === contact['DEPARTMENT']
                        );
                        if (!existContact) {
                            const _isn = this.apiSrv.sequenceMap.GetTempISN();
                            contact['ISN_CONTACT'] = _isn;
                            this.apiSrv.entityHelper.prepareAdded<CONTACT>(contact, 'CONTACT');
                            contacts.push(contact);
                            // Object.assign(contact, _contact);
                            results.push({
                                success: true,
                                record: contact
                            });
                        } else {
                            contact['ISN_CONTACT'] = existContact['ISN_CONTACT'];
                            results.push({
                                record: contact,
                                success: false,
                                error: new RestError({
                                    isLogicException: true,
                                    message: 'Контакт существует!'
                                })
                            });
                        }
                    });
                    const changes = this.apiSrv.changeList([org]);
                    if (changes) {
                        return this.apiSrv.batch(changes, '')
                            .then((resp) => this.createNewContactsSEV(newContacts, resp))
                            .then((sevResults) => results.concat(sevResults));
                    } else {
                        return results;
                    }
                }
                return results;
            });
    }
    public combine(slicedNodes: EosDictionaryNode[], markedNodes: EosDictionaryNode[]): Promise<any> {
        const preSave = [];
        let paramsSop = '';
        let change: Array<any> = [{
            method: 'MERGE',
            requestUri: `ORGANIZ_CL('${markedNodes[0].id}')`,
            data: {
                DELETED: 1
            }
        }];
        slicedNodes.forEach((node, i) => {
            preSave.push({
                method: 'DELETE',
                requestUri: `ORGANIZ_CL('${node.id}')`
            });
            i !== slicedNodes.length - 1 ? paramsSop += `${node.id},` : paramsSop += `${node.id}`;
        });
        PipRX.invokeSop(change, 'ClassifJoin_TRule', { 'pk': markedNodes[0].id, 'type': 'ORGANIZ_CL', 'ids': paramsSop }, 'POST', false);
        preSave.push({
            method: 'MERGE',
            requestUri: `ORGANIZ_CL('${markedNodes[0].id}')`,
            data: {
                DELETED: 0
            }
        });
        change = change.concat(preSave);
        return this.apiSrv.batch(change, '');
    }
    public getConfigOpenGopRc(flag: boolean, node: EosDictionaryNode, nodeId: string, paramsMode) {
        const config = {
            classif: 'gop_rc',
            id: 'ORGANIZ_dict',
        };
        if (flag) {
            config['user_id'] = -1;
            config['folder_due'] = nodeId;
        } else {
            config['user_id'] = node.getFieldValue(node._descriptor.fieldsMap.get('ISN_NODE') as any);
            config['folder_due'] = nodeId;
            config['due'] = node.id;
            if (!paramsMode) {
                config['editMode'] = true;
            }
        }
        return config;
    }
    public getRelatedFields2(tables: {table: string, order?: string } [], nodes: EosDictionaryNode[], loadAll: boolean, ignoreMetadata = false): Promise<any> {
        return super.getRelatedFields2(tables, nodes, loadAll, ignoreMetadata).then(result => {
            if (result.hasOwnProperty('ADDR_CATEGORY_CL')) {
                result['ADDR_CATEGORY_CL'] = result['ADDR_CATEGORY_CL'].filter((data: ADDR_CATEGORY_CL) => {
                    return data.ISN_LCLASSIF > 0;
                });
            }
            return result;
        });
    }
    public updateUncheckCitizen(nodes: EosDictionaryNode[]): Promise<any> {
        const change = [];
        nodes.forEach(node => {
            if (node.data.rec.NEW_RECORD === 1) {
                change.push({
                    method: 'MERGE',
                    requestUri: `ORGANIZ_CL('${node.id}')`,
                    data: {
                        NEW_RECORD: 0
                    }
                });
            }
        });
        if (change.length) {
            return this.apiSrv.batch(change, '');
        }
        return Promise.resolve();
    }

    /**
     * мы ориентировались на то что такого класса логику пишем на клиенте.
     * больше чтобы понять как минимизировать АПИ. (c) В. Люкевич
     */
    private createNewContactsSEV(newContacts: any[], createResp: any[]): Promise<IRecordOperationResult[]> {
        const contactsWithSev = [];
        // console.log('createNewContactsSEV', newContacts, createResp);
        createResp.forEach((newIsn) => {
            const contact = newContacts
                .find((_contact) => _contact.SEV && _contact['ISN_CONTACT'] === newIsn.TempID);
            if (contact) {
                contact.ISN_CONTACT = newIsn.ID;
                contactsWithSev.push(contact);
            }
        });

        // const contactsWithSev = newContacts.filter((contact) => contact && contact.SEV && contact['ISN_CONTACT'] > 0);

        const req = contactsWithSev.map((contact) => SevIndexHelper.CompositePrimaryKey(contact['ISN_CONTACT'], 'CONTACT'));

        // console.log('checking sevs', contactsWithSev, req);

        if (req.length) {
            return this.apiSrv.read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: PipRX.criteries({ OBJECT_NAME: 'CONTACT' }) })
                .then((sevs) => {
                    // console.log('found sevs', sevs);
                    const changes = [];
                    const results: IRecordOperationResult[] = [];

                    contactsWithSev.forEach((contact) => {
                        const existSev = sevs.find((sev) =>
                            sev.GLOBAL_ID === contact['SEV']);
                        if (existSev) {
                            results.push(<IRecordOperationResult>{
                                record: contact,
                                success: false,
                                error: new RestError({
                                    isLogicException: true,
                                    message: 'Для данного справочника уже существует индекс СЭВ с таким значением.'
                                })
                            });
                        } else {
                            const sevRec = this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(undefined, 'SEV_ASSOCIATION');
                            // console.log('new sev', sevRec);
                            sevRec.GLOBAL_ID = contact['SEV'];
                            if (SevIndexHelper.PrepareForSave(sevRec, Object.assign(contact, { 'ISN_LCLASSIF': contact.ISN_CONTACT }))) {
                                changes.push(sevRec);
                            }
                        }
                    });

                    if (changes.length) {
                        // console.log('SEV changes', changes);
                        return this.apiSrv.batch(this.apiSrv.changeList(changes), '')
                            .then(() => results);
                    } else {
                        return results;
                    }
                });
        } else {
            return Promise.resolve([]);
        }
    }
}
