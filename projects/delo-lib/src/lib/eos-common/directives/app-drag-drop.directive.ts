import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
    constructor() {
    }
    @HostListener('window:dragenter', ['$event'])
    onWindowDragEnter(event: any): void {
      event.preventDefault();
      event.stopPropagation();
    }
    
    @HostListener('dragover', ['$event'])
    onDragOver(event: any): void {
      event.preventDefault();
      event.stopPropagation();
    }
    
    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: any): void {
      event.preventDefault();
      event.stopPropagation();
    }
    
    @HostListener('drop', ['$event'])
    public onDrop(event: any): void {
      event.preventDefault();
      event.stopPropagation();

    }
}