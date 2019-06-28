import { Component, OnInit } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';

@Component({
  selector: 'eos-eos-template',
  templateUrl: './eos-template.component.html',
  styleUrls: ['./eos-template.component.scss']
})
export class EosTemplateComponent implements OnInit {

  constructor(
    private pip: PipRX
  ) { }

  ngOnInit() {
  }

  get() {
      this.pip.read({
        DOC_TEMPLATES: ALL_ROWS
      })
      .then((d) => {
          console.log(d);
      });
  }

}
