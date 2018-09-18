import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'eos-param-auth-collection',
    templateUrl: 'collection.component.html'
})

export class AuthenticationCollectionComponent {
    @Output() closeCollection = new EventEmitter();
    submit() {
        console.log('submit');
    }
    cancel() {
        this.closed();
    }
    closed() {
        this.closeCollection.emit();
    }
}
