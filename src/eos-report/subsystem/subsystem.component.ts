import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'eos-subsystem',
  templateUrl: './subsystem.component.html',
  styleUrls: ['./subsystem.component.scss']
})
export class EosReporSubsystemComponent implements OnInit {

  @Input() subSystem;
  @Input() subValue;
  constructor() {
  }

  ngOnInit() {

  }

}
