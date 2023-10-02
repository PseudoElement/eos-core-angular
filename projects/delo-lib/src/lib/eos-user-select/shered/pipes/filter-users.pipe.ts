import { Pipe, PipeTransform } from '@angular/core';
import { UsersTypeTabs } from '../consts/list-user.const';
import { UserSelectNode } from '../../../eos-user-select/list-user-select/user-node-select';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

  transform(usersList: UserSelectNode[], filterType: UsersTypeTabs, availableDues: string[], isLimitedTechnologist: boolean): UserSelectNode[] {
    if(!isLimitedTechnologist || filterType === UsersTypeTabs.AllUsers){
      return usersList;
    }else{
      return usersList.filter(user => availableDues.includes(user.data.TECH_DUE_DEP))
    }
  }

}
