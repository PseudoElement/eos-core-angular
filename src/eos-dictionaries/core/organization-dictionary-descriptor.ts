import { IRecordOperationResult } from 'eos-dictionaries/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { CONTACT, ORGANIZ_CL, SEV_ASSOCIATION } from 'eos-rest';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { TreeDictionaryDescriptor } from './tree-dictionary-descriptor';

export class OrganizationDictionaryDescriptor extends TreeDictionaryDescriptor {

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
                                    message: 'Индекс СЭВ создан ранее!'
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
