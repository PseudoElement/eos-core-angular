import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
// import { ITechUserClassifConst, E_TECH_USER_CLASSIF_CONTENT, /*IConfigUserTechClassif */ } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/tech-user-classif.interface';
import { IParamUserCl, IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { NodeRightInFileCard } from '../node-in-file-card';
// import { RightsDeloCardIndexRightsComponent } from '../rights-delo-card-index-rights.component';

export class RightSideDocGroupInFileCardNode {
    listContent: NodeDocsTree[] = [];
    curentSelectedNode: NodeDocsTree;
    isLoading: boolean;
    isShell: Boolean = false;
    set isExpanded(v: boolean) {
     /*   this._isExpanded = v;
        if (v && this._listUserTech.length && !this.listContent.length) {
            this._createListContent(this._listUserTech, this.listContent);
        }*/
    }
    get isExpanded() {
       return this._isExpanded;
    }
  /*  get expandable (): boolean {
        return (this._item.expandable !== E_TECH_USER_CLASSIF_CONTENT.none) && !!this._value;
    }
    get key(): number {
        return this._item.key;
    }
    get type(): E_TECH_USER_CLASSIF_CONTENT {
        return this._item.expandable;
    } */
    get label(): string {
        return this._item.label;
    }
    get value (): number {
        return this._value;
    }
    set value (v) {
      /*  this._valueLast = this._value;
        this._value = +v;

        const right = this._curentUser['TECH_RIGHTS'].split('');
        right[this.key - 1] = this._value.toString();
        const chenge: IChengeItemAbsolute = {
            method: 'MERGE',
            user_cl: true,
            data: {
                TECH_RIGHTS: right.join(''),
            }
        };
        this._parentNode.pushChange(chenge);
        setTimeout(() => {
            this._component.Changed.emit();
        }, 0);

        if (this.type !== E_TECH_USER_CLASSIF_CONTENT.none) {
            if (!this._valueLast && v && this.type !== E_TECH_USER_CLASSIF_CONTENT.limitation) { // создать корневой елемент
                const newNode = {
                    ISN_LCLASSIF: this._curentUser.ISN_LCLASSIF,
                    FUNC_NUM: this.key,
                    CLASSIF_ID: E_CLASSIF_ID[(this.key.toString())],
                    DUE: '0.',
                    ALLOWED: 1,
                };
                this._listUserTech.push(newNode);
                this._component.userTechList.push(newNode);
                this._parentNode.pushChange({
                    method: 'POST',
                    due: newNode.DUE,
                    funcNum: this.key,
                    data: newNode
                });
            }
            if (this._valueLast && !v) { // удалить все элементы
                this._isExpanded = false;
                if (this._listUserTech.length) {
                    this._deletAll();
                }
            }
        }*/
    }
    private _value: number;
    private _item: IInputParamControl;
  //  private _component: RightsDeloCardIndexRightsComponent;
   // private _valueLast: number;
    private _parentNode: NodeRightInFileCard;
    private _curentUser: IParamUserCl;
    private _isExpanded: boolean;
  //  private _listUserTech: any[] = [];
  //  private _config: IConfigUserTechClassif;
    constructor(item: IInputParamControl, user: IParamUserCl, pNode: NodeRightInFileCard, component) {
        this._item = item;
        this._curentUser = user;
        this._parentNode = pNode;
      //  this._component = component;
      console.log(component);
        console.log(this._curentUser);
      //  const v = +(this._curentUser['TECH_RIGHTS'][item.key - 1]);
      //  console.log(v);
     //   console.log(this._config);
      /*  if ((this.type !== E_TECH_USER_CLASSIF_CONTENT.none) && !this._parentNode.isCreate) {
           this._listUserTech = this._component.userTechList.filter((i) => i['FUNC_NUM'] === this.key);
        }
        if (this.type !== E_TECH_USER_CLASSIF_CONTENT.none) {
            this._config = this._component.getConfig(this.type);
        } */
        if (this._parentNode.isCreate ) {
            this._value = 0;
        //    this.value = v;
            return;
        }
      //  this._value = v;
      //  this._valueLast = v;
    }
}
