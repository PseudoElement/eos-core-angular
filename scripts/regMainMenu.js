pluginManager.registerMenuItem("mainmenu", {
    title: "Справочники",
    insertAt: {
        parent: "Администрирование"
    },
    func: function () { location.href = pluginManager.basePath + "сlassif/index.html"; },
});