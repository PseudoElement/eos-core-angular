import { Injectable } from '@angular/core';
import { Manager } from '@eos/jsplugins-manager';
import { IFonLists } from '../../eos-backgraund-tasks/interface';

@Injectable({
  providedIn: 'root'
})
export class FonTasksService {
  tasksList: IFonLists[] = [];
  activeTask: IFonLists | null = null;
  loadedPlugins: Set<any> = new Set();
  saveTaskId: string;
  constructor() {
    this.loadTaskLists();

  }

  loadTaskLists(): any {
    try {
      this.tasksList = Manager.data.getArray<IFonLists>('eos-admin-fon-tasks');
    } catch (error) {
      console.log('Ошибка получения getArray', error);
    }
    return this.tasksList;
  }

  getCurrentTaskList(id: string): IFonLists | null {
    try {
      if (this.tasksList.length) {
        return this.tasksList.find(list => list.id === id);
      }
    } catch (error) {
      console.log('Ошибка получение плагина id', error);
    }
    return null;
  }
}
