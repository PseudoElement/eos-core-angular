export interface IFonLists {
  /* наименование плагина */
  title: string;
  /* id для редиректа, должен быть уникальным в рамках раздела встраивания (Фоновые задачи или Инструменты)  */
  id: string;
  /* путь к иконке */
  icon: string;
  /*
    тип плагина. для popUp убираем редирект,
    для js выполняем проверку на наличие загруженного скрипта
    если загружен то вызываем только метод render
  */
  type: ETypeFon;
  /* проверка доступа к плагину  */
  checkAccess: () => Promise<boolean>;
  /* метод загрузки плагина, если js то загрузка скрипта на страницу, если popup, открытие окна плагина */
  loadPlugin: (mountPoint: string) => any;
  /* вызов отрисовки плагина, если плагин на реакте, то нужно врапнуть рендер в ф-цию */
  render: (mountPoint: string, scriptAppend: string) => void;
}

export enum ETypeFon {
  frame,
  popUp,
  js
}


