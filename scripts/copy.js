var fs = require('fs');

// File "destination.txt" will be created or overwritten by default.
fs.copyFile('./scripts/regMainMenu.js', './dist/regMainMenu.js', (err) => {
    if (err)
        throw err;
    console.log('regMainMenu.js was copied to ./dist/regMainMenu.js');
});
fs.copyFile('./scripts/plugin.json', './dist/plugin.json', (err) => {
    if (err)
        throw err;
    console.log('plugin.json was copied to ./dist/plugin.json');
});