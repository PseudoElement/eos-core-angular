import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ALL_ROWS, PipRX } from '../../../eos-rest';
import { Router } from '@angular/router';

@Component({
    selector: 'eos-tools-control-cache',
    templateUrl: 'control-cache.component.html'
})
export class ToolsControlCache implements OnDestroy, OnInit {
    @Input() btnError;
    isLoading = false;
    allCashe;
    allInfo;
    dateCache;
    selfLink: any;
    link: '';
    titleHeader = 'Управление кэшем';
    constructor(
            private pip: PipRX,
            private _router: Router) {}
    ngOnInit() {
        this.dateCache = this.getDataNow();
        this.getAllCache();
        this.getAllInfo();
        this.selfLink = this._router.url.split('?')[0];
    }
    ngOnDestroy(): void {
        
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
    async updateInfo() {
        await this.getAllInfo();
    }
    close() {
        this._router.navigate(['tools']);
    }
    getAllInfo(): Promise<any[]> {
        return this.pip.read<any>({
            'CacheStates': ALL_ROWS
          })
        .then((data) => {
            this.allInfo = data;
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
    getDataInfo(infoData: string): string {
        if (infoData) {
            return infoData.split('T')[1].split('+')[0];
        } else {
            return '';
        }
        
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
