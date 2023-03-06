const fs = require('fs');

const fileDev = fs.readFileSync('./projects/delo-lib/src/lib/environments/environment.prod.ts');
fs.writeFileSync('./projects/delo-lib/src/lib/environments/environment.ts', fileDev);