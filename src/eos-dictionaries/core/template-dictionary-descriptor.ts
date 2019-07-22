import { RecordDescriptor } from './record-descriptor';
import { DictionaryDescriptor } from './dictionary-descriptor';
export class TemplateDictionaryDescriptor extends DictionaryDescriptor {
    record: RecordDescriptor;

    addRecord(data: any, _useless: any, isProtected = false, isDeleted = false): Promise<any> {
        return super.addRecord(data, _useless).then((id) => {
          //  console.log(id);
        }).catch(error => {
         //   console.log(error);
        });
    }
    useSoapLoad() {

    }

    useSoapDelete() {

    }

    useSoapUnload() {

    }
}
