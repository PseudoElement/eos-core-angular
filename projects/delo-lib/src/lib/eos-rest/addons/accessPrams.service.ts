import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccessParamsServiceLib {
    constructor(
    ) {

    }

    public access(): Promise<boolean> {
        return Promise.resolve(true);
    }
    public getCanActivate(userProfile, conf): boolean {
        return (userProfile.TECH_RIGHTS && (!!+userProfile.TECH_RIGHTS[(conf.key - 1)] || !!+userProfile.TECH_RIGHTS[29] || !!+userProfile.TECH_RIGHTS[1]));
    }
}
