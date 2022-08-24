import { Injectable } from '@angular/core';
import RuntimePluginsManager from '@eos/jsplugins-manager';
import { IFonLists } from 'eos-backgraund-tasks/interface';

@Injectable({
  providedIn: 'root'
})
export class FonTasksService {
  tasksList: IFonLists[] = [];
  activeTask: IFonLists | null = null;
  loadedPlugins: Set<any> = new Set();
  constructor() {
    this.loadTaskLists();

  }

  loadTaskLists(): any {
    this.tasksList = RuntimePluginsManager.getArray<IFonLists>('eos-admin-fon-tasks');
    return this.tasksList;
  }

  getCurrentTaskList(id: string): IFonLists | null {
    if (this.tasksList.length) {
      return this.tasksList.find(list => list.id === id);
    }
    return null;
  }
}
