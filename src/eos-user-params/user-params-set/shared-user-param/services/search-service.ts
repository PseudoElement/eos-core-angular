import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ReplaySubject} from 'rxjs';

@Injectable()
export class SearchService {
    emailExtChangeSubject: ReplaySubject<number> = new ReplaySubject(1);
    emailExtChangeObservable: Observable<number> = this.emailExtChangeSubject.asObservable();
}
