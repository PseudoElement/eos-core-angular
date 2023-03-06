import { Component, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
    selector: 'eos-dictionary-paste',
    templateUrl: 'dictionary-paste.component.html'
})

export class DictionaryPasteComponent implements OnInit {
    @Output() closeWindowCheck: EventEmitter<any> = new EventEmitter();
    whenCopyNode = 0;
    disabledFirst = false;
    fullWhenCopy: string[] = ['no_copy', 'as_is', 'restore'];
    ngOnInit() {
        console.log('test');
    }
    createUpdate() {
        this.closeWindowCheck.emit({
            'cancel': false,
            'whenCopy': this.fullWhenCopy[this.whenCopyNode],
        });
    }
    cancelUpdate() {
        this.closeWindowCheck.emit({'cancel': true});
    }
}
