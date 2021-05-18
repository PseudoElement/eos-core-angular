import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EosStorageService } from 'app/services/eos-storage.service';

interface CanDeactivateDict {
    canDeactivate(): boolean;
}

@Injectable()
export class CanDeactivateDictGuard implements CanDeactivate<CanDeactivateDict> {
    constructor(
        private _storageSrv: EosStorageService
    ) {

    }

    canDeactivate() {
        this._storageSrv.removeItem('markedNodes');
        return true;
    }

}
