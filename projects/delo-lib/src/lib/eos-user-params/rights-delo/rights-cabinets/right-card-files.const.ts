import { ITableHeader } from "../../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces";

export const TABLE_HEADER_CARD: ITableHeader[] = [
    {
      title: 'Гл...',
      id: 'Icons',
      style: {width: '62px'}
    },
    {
      title: 'Наименование',
      id: 'cardTitle',
      style: {width: 'calc(100% - 62px)'}
    },
];
export const TABLE_HEADER_CARD_SECOND: ITableHeader[] = [
    {
      title: 'Гл...',
      id: 'Icons',
      fixed: true,
      style: {'min-width': '58px'}
    },
    {
      title: 'Наименование',
      id: 'cabTitle',
      fixed: true,
      style: {'min-width': '200px'}
    },
    {
        title: 'Поступившие',
        id: 'FOLDERS_AVAILABLE_1',
        style: {
            'min-width': '140px',
        }
    },
    {
        title: 'На исполнении',
        id: 'FOLDERS_AVAILABLE_2',
        style: {
            'min-width': '130px',
        }
    },
    {
        title: 'На контроле',
        id: 'FOLDERS_AVAILABLE_3',
        style: {
            'min-width': '130px',
        }
    },
    {
        title: 'У руководства',
        id: 'FOLDERS_AVAILABLE_4',
        style: {
            'min-width': '130px',
        }
    },
    {
        title: 'На рассмотрении',
        id: 'FOLDERS_AVAILABLE_5',
        style: {
            'min-width': '130px',
        }
    },
    {
        title: 'В дело',
        id: 'FOLDERS_AVAILABLE_6',
        style: {
            'min-width': '130px',
        }
    },
    {
        title: 'Управление проектами',
        id: 'FOLDERS_AVAILABLE_7',
        style: {
            'min-width': '130px',
        }
    },
    {
        title: 'На визировании',
        id: 'FOLDERS_AVAILABLE_8',
        style: {
            'min-width': '130px',
        }
    },
    {
        title: 'На подписании',
        id: 'FOLDERS_AVAILABLE_9',
        style: {
            'min-width': '130px',
        }
    },
    {
        title: 'РК. Учитывать ограничение доступа по грифам и группам документов',
        id: 'HIDE_INACCESSIBLE',
        style: {
            'min-width': '130px',
        }
    },
    {
        title: 'РКПД. Учитывать права.',
        id: 'HIDE_INACCESSIBLE_PRJ',
        style: {
            'min-width': '130px',
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
];