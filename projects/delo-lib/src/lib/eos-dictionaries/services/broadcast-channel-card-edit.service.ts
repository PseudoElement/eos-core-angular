import { Injectable } from '@angular/core';
import { LIB_LIBRARY, LIB_PARAM, PipRX } from '../../eos-rest';
import { InputBase } from '../../eos-common/core/inputs/input-base';
import { IEmailChannelAccordion, IFileSystemAccordions, OptionDiscription } from '../consts/dictionaries/sev/types.consts';
import { ISettingEmailCommon } from '../../eos-parameters/interfaces/app-setting.interfaces';
import { AppsettingsParams, AppsettingsTypename } from '../../eos-common/consts/params.const';


@Injectable({
  providedIn: 'root'
})
export class BroadcastChannelCardEditService {

  constructor(private _apiSrv: PipRX) {}
  public async setFileSystemAccordionData(inputs: Record<string, InputBase<string>>): Promise<IFileSystemAccordions> {
    const options = await this._getFileSystemAccordionOptions();
    inputs['rec.OUT_STORAGE'].options = options;
    inputs['rec.IN_STORAGE'].options = options;
    return {
      INCOMING: {
        isOpen: false,
        title: 'Исходящие сообщения',
        inputSelect: inputs['rec.OUT_STORAGE'],
        inputText: inputs['rec.OUT_FOLDER'],
      },
      OUTGOING: {
        isOpen: false,
        title: 'Входящие сообщения',
        inputSelect: inputs['rec.IN_STORAGE'],
        inputText: inputs['rec.IN_FOLDER']
      }
    }
  }
  public async setEmailAccordionData(inputs: Record<string, InputBase<string>>): Promise<IEmailChannelAccordion>{
    const options = await this._getEmailAccordionOptions();
    inputs['rec.EMAIL_PROFILE'].options = options;
    return {
        title:'Канал E-mail', 
        additionalInfo: 'Рекомендуется использовать профиль электронной почты. Изменение настроек доступно только в профиле.',
        inputSelect: inputs['rec.EMAIL_PROFILE'],
        isOpen: false
    }
  }
  private async _getEmailAccordionOptions(): Promise<OptionDiscription[]>{
    const profileNames = await this._apiSrv.getAppSetting<Record<string, ISettingEmailCommon>>({
      namespace: AppsettingsParams.Email,
      typename: AppsettingsTypename.TCommon,
    });
    const options = Object.entries(profileNames).map(([appSettingsInstance, {EmailAccount, ProfileName}]) => {
      const title = `${ProfileName}${EmailAccount && ` (${EmailAccount})`}`
      return {value: appSettingsInstance, title}
    }) as OptionDiscription[]
    return options;
   }
  private async _getFileSystemAccordionOptions(): Promise<OptionDiscription[]>{
    const libParams = await this._apiSrv.read<LIB_PARAM>({
      LIB_PARAM: {
          criteries: {
            PARAM_VALUE: 'FS',
          }
    }})
    const isnLibrariesToString = libParams.map(({ISN_LIBRARY}) => ISN_LIBRARY).join('|');
    const storages = await this._apiSrv.read<LIB_LIBRARY>({
        LIB_LIBRARY:{ 
            criteries:{
                ISN_LIBRARY: isnLibrariesToString
            }
        }
    })
    const options = storages.map(({NAME, DESCRIPTION}) => ({value: NAME, title: DESCRIPTION})) as OptionDiscription[];
    return options;
  }

}
