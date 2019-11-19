import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { CA_CATEGORY } from 'eos-rest';
interface Dm {
    tag: string;
    children: {
        tag: string;
        children: any;
    };
}
@Component({
    selector: 'eos-eds-import',
    templateUrl: './eds-import.component.html',
    styleUrls: ['./eds-import.component.scss']
})
export class EdsImportComponent implements OnInit {
    node: any;
    countLoad = 0;
    fromLoad = 0;
    upload = false;
    load = false;
    DataForDb = [];
    domModel: Dm = {
        tag: 'АккредитованныеУдостоверяющиеЦентры',
        children: {
            tag: 'УдостоверяющийЦентр',
            children: {
                tag: 'ПрограммноАппаратныеКомплексы',
                children: {
                    tag: 'ПрограммноАппаратныйКомплекс',
                    children: {
                        tag: 'КлючиУполномоченныхЛиц',
                        children: {
                            tag: 'Ключ',
                            children:
                            {
                                tag: 'Сертификаты',
                                children:
                                {
                                    tag: 'ДанныеСертификата',
                                    children: null,
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    logs = [];
    fatalError = [];
    get btnValue() {
        if (!this.load) {
            return 'Загрузить';
        }
        return 'Прервать';
    }
    get saveDisable() {
        return this.fatalError.length || !this.DataForDb.length;
    }
    private _caCategory: CA_CATEGORY[] = [];
    private iter: IterableIterator<any>;
    constructor(
        public bsModalRef: BsModalRef,
    ) { }

    ngOnInit() {
    }

    close() {
        this.bsModalRef.hide();
    }

    save() {
        this.load = !this.load;
        this._getIte();
        this._setIteralbleSave(this.iter.next());
    }
    stop() {
        this.countLoad++;
        this.load = false;
    }
    // pause() {
    //     this.load = !this.load;
    //     if (this.load) {
    //         this._setIteralbleSave(this.iter.next());
    //     }
    // }
    readFile(evt) {
        this.reset();
        const files = evt.target.files;
        const file = files[0];
        if (file) {
            this.upload = true;
            const reader = new FileReader();
            reader.onload = (fileLoaded) => {
                let parseDoc = null;
                try {
                    parseDoc = new DOMParser().parseFromString(fileLoaded.target['result'] as string, 'application/xml');
                } catch (e) {
                    this.setErrors(e);
                    this.upload = false;
                    return;
                }
                this.checkDom(parseDoc, this.domModel);
                if (!this.fatalError.length) {
                    this.getCaCategory().then(() => {
                        this.fromLoad = this.DataForDb.length;
                        this.upload = false;
                    });
                }
            };
            reader.onerror = (e) => {
                this.setErrors(e);
                this.upload = false;
            };
            reader.readAsText(file);
        }
    }
    checkDom(dom: Document, srcTag: Dm) {
        //   debugger;
        const tag = srcTag.tag;
        if (!srcTag.children) {
            if (tag === 'ДанныеСертификата') {
                this.searchElements(dom, tag);
            }
            return;
        }

        const collection = Array.prototype.slice.call(dom.querySelectorAll(tag));
        if (!collection.length) {
            if (tag !== 'ПрограммноАппаратныйКомплекс') {
                this.setErrors(tag);
                this.upload = false;
            }
            return;
        }
        collection.forEach((element: any) => {
            this.checkDom(element, srcTag.children);
        });
    }
    searchElements(dom: Document | Element, tag) {
        // поиск по 'ДанныеСертификата' нужной инф. о сертах
        const nodeList = Array.prototype.slice.call(dom.querySelectorAll(tag));
        nodeList.forEach(sertNode => {
            this.getSertsInfo(sertNode);
        });
    }
    getSertsInfo(el: Element) {
        const ca_SERIAL = el.getElementsByTagName('СерийныйНомер');
        const ca_SUBJECT = el.getElementsByTagName('КомуВыдан');
        if (this.hasContent(ca_SERIAL, ca_SUBJECT)) {
            this.DataForDb.push({
                ISN_EDS_CATEGORY: this.node.id,
                serial: ca_SERIAL[0].textContent,
                subject: ca_SUBJECT[0].textContent.trim().replace(/'/g, '""'),
            });
        }
    }
    hasContent(serialNumber: HTMLCollection, issusedBy: HTMLCollection): boolean {
        if ((serialNumber.length && serialNumber[0].textContent.trim() !== '') || (issusedBy.length && issusedBy[0].textContent.trim() !== '')) {
            return true;
        } else {
            if (!serialNumber.length) {
                this.setErrors('СерийныйНомер');
            }
            if (!issusedBy.length) {
                this.setErrors('КомуВыдан');
            }
            this.setErrorsHasWrityer(null, null, 'Ошибка создания записи', 'Ошибка записи Blob variable for UPDATEBLOB cannot be empty');
            return false;
        }
    }

    getCaCategory(): Promise<any> {
        return this.node.dictionary.dictDescrSrv.apiSrv.read({
            CA_CATEGORY: {
                criteries: {
                    ISN_EDS_CATEGORY: this.node.id,
                }
            }
        }).then((data) => {
            if (data && data.length) {
                this._caCategory = data;
                this.checkDuplicateEntries();
            }
            return Promise.resolve();
        }).catch(error => {
            this.setErrors(error.message);
        });
    }
    checkDuplicateEntries() {
        this._caCategory.forEach((ca_category: CA_CATEGORY) => {
            const findDuplicate = this.DataForDb.filter(newCaCategory => {
                return ca_category.CA_SERIAL === newCaCategory.serial && ca_category.CA_SUBJECT === newCaCategory.subject;
            });
            if (findDuplicate.length) {
                const indexDuplicate = this.DataForDb.indexOf(findDuplicate[0]);
                if (indexDuplicate !== -1) {
                    this.logDuplicateEntries(indexDuplicate);
                }
            }
        });
    }
    logDuplicateEntries(index: number) {
        const duplicEntries = this.DataForDb.splice(index, 1);
        if (duplicEntries.length) {
            this.setErrorsHasWrityer(duplicEntries[0].serial, duplicEntries[0].subject, 'Запись уже имеется в базе');
        }
    }

    setErrors(tag) {
        this.fatalError.push({
            title: 'Файл не соответствует формату\n',
            message: `reason: Element cannot be empty according to the DTD/Schema.\n  srcText: <${tag}>`
        });
    }
    setErrorsHasWrityer(serial, issused, title = null, message = null) {
        this.logs.unshift({
            title,
            serial,
            issused,
            message,
        });
    }
    reset() {
        this.logs.splice(0);
        this.fatalError.splice(0);
        this.DataForDb.splice(0);
        this._caCategory.splice(0);
        this.countLoad = 0;
        this.fromLoad = 0;
    }
    saveLogs() {
        const name = 'error.txt';
        const type = 'text/plain';
        const a = document.createElement('a');
        const file = new Blob([this.createText()], { type: type });
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }
    createText(): string {
        let text = ``;
        if (this.fatalError.length) {
            this.fatalError.forEach(error => {
                text += `${error.title}\n\n` + `${error.message}\n\n\n\r`;
            });
        } else {
            if (this.logs.length) {
                this.logs.forEach(log => {
                    if (log.message) {
                        text += `${log.title}\n` + `${log.message}\n\n`;
                    } else {
                        text += `${log.title}\n ${log.serial} ${log.issused}\n\n`;
                    }
                });
            }
        }
        return text;
    }
    private _tGenerator() {
        const self = this;
        return function* () {
            let i = 0;
            while (i <= self.DataForDb.length - 1) {
                yield self.node.dictionary.dictDescrSrv.apiSrv.batch([{
                    method: 'POST',
                    requestUri: 'CA_CATEGORY',
                    data: {
                        CA_SERIAL: self.DataForDb[i].serial,
                        CA_SUBJECT: self.DataForDb[i].subject,
                        ISN_EDS_CATEGORY: self.node.id
                    }
                }]);
                i++;
            }
        };
    }
    private _getIte() {
        this.iter = this._tGenerator()();
    }
    private _setIteralbleSave(iterable) {
        if (this.load) {
            if (iterable.done) {
                this.iter = null;
                this.load = false;
                this.DataForDb.splice(0);
                return;
            }
            iterable.value.then(() => {
                this.countLoad++;
                this._setIteralbleSave(this.iter.next());
            }).catch(error => {
                console.log(error + '- error');
                this.countLoad--;
                this.setErrorsHasWrityer(null, null, error.message);
                this._setIteralbleSave(this.iter.next());
            });
        } else {
            this.iter = null;
            this.DataForDb.splice(0);
            return;
        }
    }
}
