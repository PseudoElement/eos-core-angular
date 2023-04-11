import { ITableHeader } from "../../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces";

export const TABLE_HEADER_CARD: ITableHeader[] = [
    {
      title: 'Главный',
      id: 'Icons',
      order: 'none',
      style: {width: '80px'}
    },
    {
      title: 'Наименование',
      id: 'cardTitle',
      order: 'asc',
      style: {width: 'calc(100% - 80px)'}
    },
];
export const TABLE_HEADER_CARD_SECOND: ITableHeader[] = [
    {
      title: 'Гл...',
      id: 'Icons',
      fixed: false,
      order: 'none',
      style: {'width': '80px'}
    },
    {
      title: 'Наименование',
      id: 'cabTitle',
      fixed: false,
      order: 'asc',
      style: {'width': '160px'}
    },
    {
        title: 'Поступившие',
        id: 'FOLDERS_AVAILABLE_1',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'На исполнении',
        id: 'FOLDERS_AVAILABLE_2',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'На контроле',
        id: 'FOLDERS_AVAILABLE_3',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'У руководства',
        id: 'FOLDERS_AVAILABLE_4',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'На рассмотрении',
        id: 'FOLDERS_AVAILABLE_5',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'В дело',
        id: 'FOLDERS_AVAILABLE_6',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'Управление проектами',
        id: 'FOLDERS_AVAILABLE_7',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'На визировании',
        id: 'FOLDERS_AVAILABLE_8',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'На подписании',
        id: 'FOLDERS_AVAILABLE_9',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'РК. Учитывать ограничение доступа по грифам и группам документов',
        id: 'HIDE_INACCESSIBLE',
        style: {
            'width': '50px',
        }
    },
    {
        title: 'РКПД. Учитывать права.',
        id: 'HIDE_INACCESSIBLE_PRJ',
        style: {
            'width': '50px',
        }
    },
];

export const TABLE_HEADER_BTN_TABEL = [
    {
        tooltip: 'Добавить картотеку',
        disable: true,
        iconActiv: 'eos-adm-icon-plus-blue',
        iconDisable: 'eos-adm-icon-plus-grey',
        id: 'add'
    },
    {
        tooltip: 'Установить главную картотеку',
        disable: true,
        iconActiv: 'eos-adm-icon-keyfile-blue',
        iconDisable: 'eos-adm-icon-keyfile-grey',
        id: 'main'
    },
    {
        tooltip: 'Удалить картотеку',
        disable: true,
        iconActiv: 'eos-adm-icon-bin-forever-blue',
        iconDisable: 'eos-adm-icon-bin-forever-grey',
        id: 'deleted'
    },
];
export const TABLE_HEADER_BTN_TABEL_SECOND = [
    {
        tooltip: 'Установить главный кабинет',
        disable: true,
        iconActiv: 'eos-adm-icon-keyfile-blue',
        iconDisable: 'eos-adm-icon-keyfile-grey',
        id: 'main'
    },
    {
        tooltip: 'Копировать',
        disable: true,
        iconActiv: ' eos-adm-icon-copy-blue',
        iconDisable: 'eos-adm-icon-copy-grey',
        id: 'copy'
    },
    {
        tooltip: 'Вставить',
        disable: true,
        iconActiv: 'eos-adm-icon-paste-blue',
        iconDisable: 'eos-adm-icon-paste-grey',
        id: 'insert'
    }, 
    {
        tooltip: 'Все папки кабинета',
        disable: true,
        iconActiv: 'eos-adm-icon-checkbox-blue',
        iconDisable: 'eos-adm-icon-checkbox-grey',
        id: 'checked'
    },
    {
        tooltip: 'Все кабинеты картотеки',
        disable: true,
        iconActiv: 'eos-adm-icon-done-blue',
        iconDisable: 'eos-adm-icon-done-grey',
        id: 'checked-cabinet'
    },
    {
        tooltip: 'Развернутый вид',
        disable: true,
        iconActiv: 'eos-adm-icons-expand-blue',
        iconDisable: 'eos-adm-icons-expand-grey',
        id: 'expand',
        activeIcon: 'eos-adm-icons-expand-white',
        active: false
    },
];