var fs = require('fs');

// File "destination.txt" will be created or overwritten by default.
fs.copyFile('./scripts/regMainMenu.js', './dist/box/regMainMenu.js', (err) => {
    if (err)
        throw err;
    console.log('regMainMenu.js was copied to ./dist/box/regMainMenu.js');
});
fs.copyFile('./scripts/plugin.json', './dist/box/plugin.json', (err) => {
    if (err)
        throw err;
    console.log('plugin.json was copied to ./dist/box/plugin.json');
});