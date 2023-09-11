import { Injectable } from '@angular/core';
import { IComparedProtocol } from '../intrfaces/protocol.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  private readonly BODY = '{{BODY}}';
  private readonly STYLES = '{{STYLES}}';
  private readonly TITLE = '{{TITLE}}';
  private readonly red: string = '#f0978b';
  private readonly green: string = '#7dc868';
  private readonly HEAD: string = `
  <head>
    <title>${this.TITLE}</title>
    <style>
      ${this.STYLES}
    </style>
  </head>
  `
  private readonly templateForSave: string = `
  <html>
    ${this.HEAD}
    <body>
      ${this.BODY}
    </body>
  </html>
  `
  private readonly printStyles = `
    body{
      display: flex !important;
      width: 100%;
      justify-content: space-around;
    }
    #selected-protocol, #prev-protocol{
      padding: 5px !important;
    }
    .two-protocols-compare-wrapper{
      display: flex !important;
    }
    .bold {
      font-weight: bold !important;
    }
    .wideTable {
      width: 100% !important;
      border-collapse: collapse !important;
    }
    .wideTable tr.header {
      font-weight: bold !important;
      font-size: 13pt !important;
      background-color: lightgrey !important;
    }
    .wideTable td {
      border-collapse: collapse !important;
      padding: 5px !important;
      vertical-align: top !important;
      border-bottom: 1px solid lightgrey !important;
    }
    .wideTable tr.lastRow td {
          height: 20px !important;
          border: none !important;
          border-top: 2px solid white !important;
      }
    .hidden {display: none !important;}
    .hidden td {
          display: none !important;
      }
    .wideTable tr:first-of-type td, .wideTable tr:last-of-type td {
          border-bottom: none !important;
      }

    .wideTable td:nth-child(1) {width: 40% !important;}
    .wideTable td:nth-child(2) {width: 60% !important;}
    .red-span{background-color: ${this.red} !important;}
    .green-span{background-color: ${this.green} !important;}
`
  private readonly mediaPrint: string = `
  @media print{
    ${this.printStyles}
  }`
  constructor() { }
  public printOnlyOneTag(selector: string) {
    this._setStylesForPrint()
    const printContents = document.querySelector(selector).innerHTML;
    this._setHead('Изменения учетной записи и прав пользователя');
    document.body.innerHTML = printContents;
    window.print();
    document.body.style.visibility = 'visible';
    window.location.reload();
  }
  public saveComparedProtocols(html: string): void {
    const htmlForSave = this.templateForSave.replace(this.BODY, html).replace(this.STYLES, this.printStyles)
    const htmlContent = [htmlForSave];
    const blob = new Blob(htmlContent, { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Информация об учетной записи и правах пользователя.html";
    a.hidden = true;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
  }

  public compareProtocols(selectedProtocol: IComparedProtocol, prevProtocol: IComparedProtocol): void {
    try {
      const selectedProtocolNode = document.getElementById(selectedProtocol.id);
      const prevProtocolNode = document.getElementById(prevProtocol.id);
      this._applyStyles(selectedProtocol.innerHTML);
      const struct1 = this._convertHtmlToStruct(prevProtocol.innerHTML);
      const struct2 = this._convertHtmlToStruct(selectedProtocol.innerHTML);
      const [comparedStruct1, comparedStruct2] = this._compareStructs(struct1, struct2);
      const comparedHtml1 = this._createHtmlFromStruct(comparedStruct1, 'red-span', 'Предыдущее состояние');
      const comparedHtml2 = this._createHtmlFromStruct(comparedStruct2, 'green-span', 'Текущее состояние');
      if (selectedProtocolNode) selectedProtocolNode.innerHTML = comparedHtml1;
      if (prevProtocolNode) prevProtocolNode.innerHTML = comparedHtml2;
      const spansGreen = prevProtocolNode.querySelectorAll('.green-span') as NodeListOf<HTMLElement>
      const spansRed = selectedProtocolNode.querySelectorAll('.red-span') as NodeListOf<HTMLElement>
      this._setBackgroundColor(spansGreen, this.green)
      this._setBackgroundColor(spansRed, this.red)
    }
    catch (e) {
      console.error(e);
    }
  }
  private _setHead(title: string): void{
    document.head.innerHTML = this.HEAD.replace(this.TITLE, title).replace(this.STYLES, this.printStyles)
  }
  private _setStylesForPrint() {
    document.body.style.display = 'flex';
    const style = document.querySelector('head style[type="text/css"]');
    style.innerHTML += this.mediaPrint;
  }
  private _applyStyles(html: string): void {
    const mainNode = document.createElement('div');
    mainNode.innerHTML = html;
    const styles = mainNode.querySelector('style');
    document.head.appendChild(styles);
  }
  private _convertHtmlToStruct(html: string) {
    const mainNode = document.createElement('div');
    mainNode.innerHTML = html;
    const tableNodes = mainNode.querySelectorAll('table.wideTable');
    const _tables = this._nodeListToArray(tableNodes).filter(x => !x.classList.contains('hidden'));
    let previousTitle = '';
    const tables = _tables.map(table => {
      let title = this._strip(table.querySelector('tr.header td').innerHTML.trim());
      const prependRows = [];
      //кабинеты в картотеке идут сразу после картотеки или прав на нее, но не имеют в заголовке названия картотеки, из-за чего нельзя найти четкое соответсткие
      if (title === 'Кабинеты в картотеке') {
        const [_, cardName] = previousTitle.split(': ');
        if (cardName)
          title = title + ': ' + cardName;
      }
      if (title.startsWith('Учетная запись')) {
        try {
          const [_, verStart] = title.split('(');
          const [verPair] = verStart.split(')');
          const [verName, verValue, date] = verPair.split(': ');
          const fakeIn1 = document.createElement('td');
          const fakeIn2 = document.createElement('td');
          fakeIn1.innerHTML = verName[0].toUpperCase() + verName.substr(1);
          fakeIn2.innerHTML = `${verValue}: ${date}`;
          const fakeRow = document.createElement('tr');
          fakeRow.appendChild(fakeIn1);
          fakeRow.appendChild(fakeIn2);
          prependRows.push(fakeRow);
          title = 'Учетная запись';
        }
        catch (_a) { }
      }
      if (title.startsWith('Права в картотеке:') || title.startsWith('Кабинеты в картотеке:')) {
        try {
          const isMajor = title.includes('(главная картотека)');
          title = title.replace(' (главная картотека)', '');
          if (title.startsWith('Права в картотеке:')) {
            const fakeIn1 = document.createElement('td');
            const fakeIn2 = document.createElement('td');
            fakeIn1.innerHTML = 'Главная картотека';
            fakeIn2.innerHTML = isMajor ? 'Да' : 'Нет';
            const fakeRow = document.createElement('tr');
            fakeRow.appendChild(fakeIn1);
            fakeRow.appendChild(fakeIn2);
            prependRows.push(fakeRow);
          }
        }
        catch (_b) { }
      }
      const _rows = [...prependRows, ...this._nodeListToArray(table.querySelectorAll('tr.row'))];
      const rows = _rows.map((row) => {
        const text0 = this._strip(row.children[0].innerHTML.trim());
        const text1 = row.children[1].innerHTML.trim();
        const _values = text1.split('<br>').map(x => this._strip(x.replace('<span></span>', '').replace('<i></i>', '')).trim()).filter(x => !!x);
        let rows = [];
        let values = [];
        let lastKey = null;
        _values.forEach(value => {
          if (value.startsWith('<i>')) {
            lastKey = value;
            rows.push({ title: value, values: [], rows: [] });
          }
          else {
            const lastRecord = rows.find(x => x.title === lastKey);
            const getValues = (value_) => text1.includes('<br>') ? [{ value: value_ }] : value_.split(',').map(x => ({ value: x.trim() }));
            if (lastRecord)
              lastRecord.values.push(...getValues(value));
            else
              values.push(...getValues(value));
          }
        });
        return { title: text0, values, rows };
      });
      previousTitle = title;
      return { title, rows, values: [] };
    });
    return { tables };
  }
  private _nodeListToArray(nodeList: NodeListOf<Element>) {
    const array = [];
    for (let x in nodeList) {
      if (nodeList[x].id !== undefined)
        array.push(nodeList[x]);
    }
    return array;
  }
  private _strip(s) {
    return s.replace(/(\s|\n){2,}/g, ' ');
  }
  private _compareStructs(struct1, struct2) {
    return [this._compareStruct(struct1, struct2), this._compareStruct(struct2, struct1)];
  }
  private _compareStruct(struct, compareWith) {
    const comparedTables = struct.tables.map(table => {
      const sameTable = compareWith.tables.find(x => x.title === table.title);
      if (!sameTable) {
        this._setUniquinessDownToChildren(table);
        return table;
      }
      const rows = this._innerRowsComparison(table.rows, sameTable.rows);
      return Object.assign(Object.assign({}, table), { rows });
    });
    return { tables: comparedTables };
  }
  private _createHtmlFromStruct(struct, className: string, stateTitle: string) : string {
    let html = '<div class="reportSize">';
    const wrap = (value, unique) => `<span class="${unique ? className : ''}">${value}</span>`;
    struct.tables.forEach(table => {
      html += '<table class="wideTable"><tr class="header"><td colspan="2">' + wrap(table.title, table.unique) + '</td></tr>';
      html += table.rows.map(row => {
        return `<tr class="row"><td>${wrap(row.title, row.unique)}</td>
            <td>
            ${row.values.map(x => wrap(x.value, x.unique)).join('<br>')}
            ${row.rows.map(x => `${wrap(x.title, x.unique)}<br>${x.values.map(xx => wrap(xx.value, xx.unique)).join('<br>')}`).join('<br>')}
            </td>
            </tr>`;
      }).join('');
    });
    html += '</div>';
    html = `<h1 style="font-size: 18px; font-weight: bold; text-align: center;">${stateTitle}</h1>` + html
    return html;
  }
  private _innerRowsComparison(rows1, rows2) {
    const rows = rows1.map(row => {
      const sameRow = rows2.find(x => x.title === row.title);
      if (!sameRow) {
        this._setUniquinessDownToChildren(row);
        return row;
      }
      return Object.assign(Object.assign({}, row), { rows: this._innerRowsComparison(row.rows, sameRow.rows), values: this._innerValuesComparison(row.values, sameRow.values) });
    });
    return rows;
  }
  private _innerValuesComparison(values1, values2) {
    const innerValues = values1.map(innerValue => {
      const sameInnerValue = values2.find(x => x.value === innerValue.value);
      if (!sameInnerValue) {
        this._setUniquinessDownToChildren(innerValue);
        return innerValue;
      }
      return innerValue;
    });
    return innerValues;
  }
  private _setUniquinessDownToChildren(node) {
    node.unique = true;
    if (node.rows) node.rows.forEach(this._setUniquinessDownToChildren);
    if (node.values) node.values.forEach(this._setUniquinessDownToChildren);
  }
  private _setBackgroundColor(nodes: NodeListOf<HTMLElement>, color: string): void {
    nodes.forEach(node => {
      node.style.backgroundColor = color
      node.style.padding = '2px'
    })
  }
}
