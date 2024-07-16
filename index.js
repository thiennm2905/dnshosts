const fs = require('fs');
const path = require('path');
const axios = require('axios');
const list = [
  // 'https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts',
  // 'https://raw.githubusercontent.com/bigdargon/hostsVN/master/filters/adservers-all.txt',
  // 'https://abpvn.com/android/abpvn.txt',
  'https://raw.githubusercontent.com/hagezi/dns-blocklists/main/dnsmasq/ultimate.txt',
];
async function run() {
  const blocklist = [];
  for (const url of list) {
    const content = await axios.get(url);
    content.data.split('\n').map((line) => {
      const match = new RegExp(/^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\s*|0\s*|\|\||local=\/)?(([\w*-]+\.)*[\w*-]+\.[\w*-]+)/, 'mui').exec(line);
      if (match) {
        // blocklist.push('0.0.0.0 ' + match[2].replace(new RegExp(/^www\./, 'mui'), ''));
        blocklist.push('local=/' + match[2].replace(new RegExp(/^www\./, 'mui'), '') + '/');
      }
    });
  }
  const data = [...new Set(blocklist)].sort();
  console.log(data.length);
  fs.writeFileSync(path.join('blocklist_ultimate'), data.join('\n'));
}
run();