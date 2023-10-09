import { Injectable } from '@angular/core';
import { Manager } from '@eos/jsplugins-manager';
import { IFonLists } from '../../eos-backgraund-tasks/interface';

@Injectable({
  providedIn: 'root'
})
export class EosAdmToolsService {
  tasksList: IFonLists[] = [];
  activeTask: IFonLists | null = null;
  loadedPlugins: Set<any> = new Set();
  saveTaskId: string;
  constructor() {
    this.loadTaskLists();

  }

  loadTaskLists(): IFonLists[] {
    this.tasksList = Manager.data.getArray<IFonLists>('eos-admin-tools-tasks');
    return this.tasksList;
  }

  getCurrentTaskList(id: string): IFonLists | null {
    if (this.tasksList.length) {
      return this.tasksList.find(list => list.id === id);
    }
    return null;
  }
}
