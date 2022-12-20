pluginManager.registerMenuItem("mainmenu", {
    title: "Справочники",
    insertAt: {
        parent: "Администрирование"
    },
    func: function () { location.href = pluginManager.basePath + "classif/index.html"; },
});