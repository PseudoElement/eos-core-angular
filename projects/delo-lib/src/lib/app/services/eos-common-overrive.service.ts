import { Injectable } from '@angular/core';
import { Features } from '../../eos-dictionaries/features/features-current.const';
import { FeaturesDelo } from '../../eos-dictionaries/features/cb/features-cb.const';
import { IOESDictsFeatures } from '../../eos-dictionaries/features/features.interface';
import { SEV_FOLDER } from '../../eos-dictionaries/consts/dictionaries/sev/folder-sev.consts';
import { IDictionaryDescriptor } from '../../eos-dictionaries/interfaces';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { RC_CABINET_FOLDER_LIST } from '../../eos-user-params/shared/consts/rc-cabinet-folder.const';

@Injectable()
export class EosCommonOverriveService {
  public defaultFeatures: IOESDictsFeatures = FeaturesDelo
  /* переопределенный дискриптор в виде модуля */
  public features?: IOESDictsFeatures;
  /* константы метаданных для справочников */
  public overrideDictionaries?: IDictionaryDescriptor[];
  /* номер права для управлению видимостью справочников */
  public numberTechRigth?: number;
  public fnSetDescriptors?: any;
  /* какие справочники переопределить */
  public renderCardsInCardEditComponents: string[] = [];
  /* какие контролы отрисовать в карточках элементов */
  public controlsEditCard: any[] = [];

  public controlsCardDepartments: string[] = [];
  public controlsCardDepartments2: string[] = [];

  constructor() { }

  public setOverrideFeatures() {
    if (this.features) {
      Features.cfg = this.features
    }
    else {
      Features.cfg = this.defaultFeatures;
    }
  }
  public setOverrideCabinetFolder() {
    RC_CABINET_FOLDER_LIST.splice(5, 0, {
        key: 6,
        charKey: '6',
        title: 'В деле'
    });
    RC_CABINET_FOLDER_LIST.forEach((cab, index) => {
        cab.key = index + 1;
    });
  }
  public overrrideVisibleSevFolder(): any {
    SEV_FOLDER.visible = Features.cfg.SEV.isDictsEnabled
  }
  public getCheckButton(button: number, dictId: string) {
    return false;
  }
  public getOverrridesDictionaries(): IDictionaryDescriptor[] {
    return this.overrideDictionaries;
  }

  checkRigths(disctid: any) {
    return this.overrideDictionaries?.find(n => n.id === disctid);
  }
  public setCollectionDescriptors(collection: Map<any, any>) {
    this.overrideDictionaries?.forEach(_d => {
      collection.set(_d.id, _d);
    })
  }

  public visibleDictionaries() {
    return this.overrideDictionaries?.filter((dict) => dict.visible) || [];
  }

  public setDescriptor(res, descr, apiSrv) {
    if (!res) {
      if (this.fnSetDescriptors) {
        this.fnSetDescriptors(res, descr, apiSrv)
      }
    }
  }

  public checkCardElementFroCardEditComponent(dictionaryId: string): string {
    return this.renderCardsInCardEditComponents.find((el => el === dictionaryId));
  }

  public updateValidator(form: FormGroup): Array<ValidatorFn> {
    const validators = [];
    return validators;
  }

  public updateForm(context: any, formChanges: any): void {
    return void 0;
  }


  public updateNodeFields(context: any): void {
    return void 0;
  }
}
