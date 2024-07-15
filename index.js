const fs = require('fs');
const path = require('path');
const axios = require('axios');
const list = [
  'https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts',
  // 'https://raw.githubusercontent.com/hagezi/dns-blocklists/main/dnsmasq/pro.txt',
];
async function run() {
  const blocklist = [];
  for (const url of list) {
    const content = await axios.get(url);
    content.data.split('\n').map((line) => {
      const match = new RegExp(/^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\s*|(@@)?\|?\||local=\/)(([\w*-]+\.)*[\w*-]+\.[\w*-]+)/, 'mui').exec(line);
      if (match) {
        blocklist.push('local=/' + match[3].replace(new RegExp(/^www\./, 'mui'), '') + '/');
        // filters.push('0.0.0.0 ' + match[3].replace(new RegExp(/^www./, 'mui'), ''));
      }
    });
  }
  const data = [...new Set(blocklist)].sort();
  console.log(data.length);
  fs.writeFileSync(path.join('blocklist'), data.join('\n'));
  const tif = [];
  data.map(() => {
    tif.push('bogus-nxdomain=0.0.0.0');
  });
  fs.writeFileSync(path.join('tif'), tif.join('\n'));
  // fs.writeFileSync(path.join('dnsmasq.hosts'), data.join('\n'));
}
run();