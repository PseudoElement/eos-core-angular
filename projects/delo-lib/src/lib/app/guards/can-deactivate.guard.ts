import { Injectable } from '@angular/core';
import { CanDeactivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
    canDeactivate: (nextState?: RouterStateSnapshot) => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    canDeactivate(
        component: CanComponentDeactivate,
        _currentRoute: ActivatedRouteSnapshot,
        _currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        return component && component.canDeactivate ? component.canDeactivate(nextState) : true;
    }
}
