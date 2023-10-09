
# Инструкция по добавлению плагинов в приложение.

## Сборка
 Плагины для добавление вкладок с новыми плагинами в раздел администрирование используется npm пакет @eos/jsplugins-manager.

 Готовый пример можно посмотреть в репозитории  http://tfs:8080/tfs/Collection2020/Delo2020/_git/Delo2020-WebUI-lib?path=%2Fapps%2FExampleAdmPlugins

 ### Интерфейс для добавления плитки в модуль фоновые задачи.

```js
enum ETypeFon {
    popUp,
    js
}


 IFonLists {
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
    type: ETypeFon
    /* проверка доступа к плагину  */
    checkAccess: () => Promise<boolean>;
    /* метод загрузки плагина, если js то загрузка скрипта на страницу, если popup, открытие окна плагина */
    loadPlugin: (mountPoint: string) => any;
    /* вызов отрисовки плагина, если плагин на реакте, то нужно врапнуть рендер в ф-цию */
    render: (mountPoint: string) => void;
}
```

## Описание
- метод loadPlugin предназначен для загрузки скрипта в приложение, если плагин это html страница, то нужно просто открыть страницу в новом окне.
в примере для загрузки плагинов используется  @eos/jsplugins-manager
```js
RPM.loadPlugins({ targets: ["UserSession"], registryFolder: ".." });
```

документация по @eos/jsplugins-manager http://tfs:8080/tfs/Collection2020/EOSPlatform/_git/eos-jsplugins-manager

- метод  render предназначен для инициализации приложения
     в случае с плагинами на js собранными через @eos/jsplugins-manager нужно обернуть рендер в функцию

```js
function render(mountPoint: string) {
    ReactDOM.render(
        <React.StrictMode>
        <ConfigProvider prefixCls={preffixCls}>
            <EosComponentsProvider>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
            </EosComponentsProvider>
        </ConfigProvider>
        </React.StrictMode>,
        document.getElementById(mountPoint)
    );
    }
    RPM.setValue('userSession', render);
    RPM.setPluginAsLoaded();

```

После чего в плагинах "Плитках" после загрузки плагина в дом.  Можно его рендерить через @eos/jsplugins-manager

```js
        render: (mountPoint: string) => {
            RPM.getValue('userSession')(mountPoint);
        }
```

 ## Регистрация плагина
 Все плагины должны быть зарегистрированы в корне приложения в файле plugins.js по аналогии с остальными плагинами.
 Для плагинов фоновых задачь (плиток) в plugins.js в target указать 'tech_tasks'. Плагины для плиток пушить в массив 'eos-admin-fon-tasks' в
 RPM.pushValue('eos-admin-fon-tasks', f3);

== Для плагинов в модуль "Инструменты" проделать все то же самое. Только  в корне приложения в файле plugins.js в target указать 'tech_tools', а плитки регистрировать в массиве 'eos-admin-tools-tasks';


# Начало работы
В данной версии использую node16
1.	Выполнить  npm ci (установка зависимостей)

# Запуск в режиме разработки
2.	Запуск либы в режиме разработки -  build-lib-watch
3.	Перенос стилей в сборку либы - bandle-scss
4.	Копирование ресурсов в сборку либы - copy-assets
    4.1 Вместо 2 скриптов можно использовать скрипт build-resources
5.	Запуск тестового проекта, для тестирования либы - watch

# Сборка либы в прод
1. Выполнить build-lib
2. Перенос стилей в сборку либы - bandle-scss
3. Копирование ресурсов в сборку либы - copy-assets
    3.1 Вместо 2 скриптов можно использовать скрипт build-resources

# Сборка приложения в прод
1. Выполнить build-lib
2. Перенос стилей в сборку либы - bandle-scss
3. Копирование ресурсов в сборку либы - copy-assets
    3.1 Вместо 2 скриптов можно использовать скрипт build-resources
4. Выполнить npm run build



<h1>Внимание!</h1>
<h2>Во всех ts файлах импорты должны быть относительными!!!!!!!!!!!!!!!!!!!</h2>
<span>Не верно: import { EosMessageService } from 'eos-common/index';</span>
<span>Верно: import { EosMessageService } from '../../eos-common/index';</span>
