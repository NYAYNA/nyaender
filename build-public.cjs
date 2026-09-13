const fs = require('node:fs');
const path = require('node:path');
require('./test-admin.cjs');
const output = path.join(__dirname, 'public-site');
fs.mkdirSync(output, {recursive: true});
for (const name of ['index.html', 'style.css', 'app.js', 'content.json']) {
  fs.copyFileSync(path.join(__dirname, 'site', name), path.join(output, name));
}
fs.cpSync(path.join(__dirname, 'site/assets'), path.join(output, 'assets'), {recursive: true});
fs.writeFileSync(path.join(output, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n/content.json\n  Access-Control-Allow-Origin: https://nyayna.github.io\n  Cache-Control: no-cache\n');
