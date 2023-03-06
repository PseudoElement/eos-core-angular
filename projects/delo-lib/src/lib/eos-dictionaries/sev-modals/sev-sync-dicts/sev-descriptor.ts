import { IInputParamControl } from '../../interfaces/sev.interface';

export class SevDescriptor {

  fillValueInputField (fields: IInputParamControl[]) {
      const arrInput = [];
      fields.forEach((field: IInputParamControl) => {
          const f = Object.assign({}, field);
          arrInput.push(f);
          switch (f['key']) {
              case 'PASSWORD_DATE':
                  f['value'] = '';
                  f['disabled'] = false;
                  f['readonly'] = false;
                  break;
          }
      });
      return arrInput;
  }

}
