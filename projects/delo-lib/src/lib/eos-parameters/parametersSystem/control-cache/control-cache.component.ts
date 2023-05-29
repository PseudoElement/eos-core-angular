import { Component, Injector, Input } from '@angular/core';
import { ALL_ROWS, PipRX } from '../../../eos-rest';
import { BaseParamComponent } from '../shared/base-param.component';
import { CONTROL_CACHE_INFO } from '../shared/consts/control-cache.const';

@Component({
    selector: 'eos-control-cache',
    templateUrl: 'control-cache.component.html'
})
export class ParamControlCache extends BaseParamComponent {
    @Input() btnError;
    isLoading = false;
    allCashe;
    dateCache;
    constructor(injector: Injector, private pip: PipRX) {
        super(injector, CONTROL_CACHE_INFO);
        this.init()
            .then(() => {
                this.dateCache = this.getDataNow();
                this.getAllCache();
                this.form.disable({ emitEvent: false });
            })
            .catch(err => {
                if (err.code !== 434) {
                    console.log(err);
                }
            });
    }
    getAllCache(): Promise<any[]> {
        return this.pip.read<any>({
            'CacheHistory': ALL_ROWS
          })
        .then((data) => {
            this.allCashe = data;
            this.isLoading = true;
            return data;
        })
        .catch(err => {
                throw err;
        });
    }
    async cacheClear() {
        this.isLoading = false;
        await this.pip.read({
            'ClearCache': ALL_ROWS
        });
        await this.getAllCache();
        this.dateCache = this.getDataNow();
        this.isLoading = true;
    }
    getDataNow() {
        const year = new Date().getFullYear();
        const mounsN = new Date().getMonth();
        const dateN = new Date().getDate();
        const hour = new Date().getHours();
        const minutes = new Date().getMinutes()
        const date = ('' + dateN).length === 1 ? '0' + dateN : '' + dateN;
        const mouns = ('' + (mounsN + 1)).length === 1 ? '0' + (mounsN + 1) : '' + (mounsN + 1);
        return date + '.' + (mouns) + '.' + year + ' ' + hour + ':' + minutes ;
    }
    cancel() {
        this.cancelEdit();
    }
    cancelEdit() {
        this.form.disable({ emitEvent: false });
    }
    edit() {
        this.form.enable({ emitEvent: false });
    }
    submit() {
        this.form.disable({ emitEvent: false });
    }
    getFormatItem(item) {
        let str = '';
        if (!item) {
            return str;
        }
        if (item['OBJECT_ID']) {
            str += ' OBJECT_ID: ' + item['OBJECT_ID'] + ', ';
        }
        if (item['TIME_STAMP']) {
            str += ' TIME_STAMP: ' + item['TIME_STAMP'] + ', ';
        }
        if (item['KIND_OBJECT']) {
            str += ' KIND_OBJECT: ' + item['KIND_OBJECT'] + ', ';
        }
        if (item['ISL_EVENT']) {
            str += ' ISL_EVENT: ' + item['ISL_EVENT'] + ', ';
        }
        return str;
    }
}
