const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const jsdom = require("jsdom");
const mysql = require("mysql");
const { JSDOM } = jsdom;

const proxyUrls = [
  '166.88.235.106:6415',
  '166.88.64.215:6137',
  '136.0.207.15:5964',
  '142.111.255.67:5960',
  '23.229.110.4:8532',
  '50.200.12.87:80',
  '72.10.160.171:5369',
  '20.210.113.32:80',
  '50.231.172.74:80',
  '50.174.7.158:80',
  '195.181.172.230:8082',
  '50.222.245.42:80',
  '50.207.199.86:80',
  '50.170.90.26:80',
  '50.168.163.182:80',
  '50.168.7.250:80',
  '50.222.245.40:80',
  '50.223.246.226:80',
  '50.219.244.0:80',
  '189.202.188.149:80',
  '213.143.113.82:80',
  '117.250.3.58:8080',
  '50.172.75.124:80',
  '50.174.145.9:80',
  '116.203.28.43:80',
  '50.174.145.10:80',
  '50.175.212.74:80',
  '50.174.41.66:80',
  '167.114.107.37:80',
  '50.239.72.19:80',
  '209.97.150.167:3128',
  '50.173.140.150:80',
  '50.173.140.146:80',
  '162.223.91.11:80',
  '202.5.16.44:80',
  '50.172.75.120:80',
  '50.200.12.83:80',
  '50.219.244.6:80',
  '213.157.6.50:80',
  '80.120.130.231:80',
  '213.33.2.28:80',
  '50.223.38.6:80',
  '50.206.111.89:80',
  '50.175.212.79:80',
  '50.222.245.43:80',
  '50.222.245.41:80',
  '50.200.12.80:80',
  '50.169.23.170:80',
  '50.168.210.235:80',
  '50.168.210.234:80',
  '50.222.245.47:80',
  '50.217.29.198:80',
  '68.185.57.66:80',
  '50.168.89.184:80',
  '50.174.7.153:80',
  '50.168.163.179:80',
  '190.58.248.86:80',
  '50.206.111.88:80',
  '50.239.72.17:80',
  '50.174.7.156:80',
  '50.168.72.116:80',
  '50.220.168.134:80',
  '82.119.96.254:80',
  '68.188.59.198:80',
  '50.218.57.71:80',
  '62.99.138.162:80',
  '50.206.111.91:80',
  '50.173.140.138:80',
  '50.217.226.45:80',
  '50.206.111.90:80',
  '50.174.7.157:80',
  '18.132.210.50:1080',
  '50.217.226.47:80',
  '50.204.219.228:80',
  '50.222.245.45:80',
  '50.207.199.84:80',
  '50.174.145.8:80',
  '50.173.140.148:80',
  '50.207.199.80:80',
  '213.33.126.130:80',
  '50.168.72.118:80',
  '50.207.199.85:80',
  '50.168.163.183:80',
  '50.207.199.81:80',
  '50.170.90.24:80',
  '50.168.72.113:80',
  '20.24.43.214:80',
  '50.207.199.87:80',
  '50.207.199.83:80',
  '85.26.146.169:80',
  '50.170.90.27:80',
  '50.168.72.115:80',
  '50.173.140.151:80',
  '80.228.235.6:80',
  '50.168.163.181:80',
  '50.217.226.41:80',
  '50.217.226.44:80',
  '47.254.91.248:3773',
  '50.218.57.64:80',
  '50.200.12.84:80',
  '50.230.222.202:80',
  '50.218.57.67:80',
  '47.74.152.29:8888',
  '50.217.226.42:80',
  '50.174.7.159:80',
  '188.124.230.43:27333',
  '113.176.95.208:8080',
  '41.218.86.118:83',
  '179.12.51.141:41890',
  '192.69.57.1:16099',
  '202.131.65.110:80',
  '45.56.119.212:8015',
  '207.2.120.15:80',
  '198.199.86.11:8080',
  '50.122.86.118:80',
  '133.18.234.13:80',
  '167.99.233.164:8000',
  '54.233.119.172:3128',
  '32.223.6.94:80',
  '66.191.31.158:80',
  '41.207.187.178:80',
  '66.29.154.103:3128',
  '50.237.207.186:80',
  '178.128.113.118:23128',
  '123.30.154.171:7777',
  '44.213.196.246:8080',
  '95.56.121.95:3128',
  '198.176.56.39:80',
  '114.156.77.107:8080',
  '50.174.145.14:80',
  '50.173.140.147:80',
  '50.218.224.35:80',
  '50.174.216.110:80',
  '50.219.244.2:80',
  '113.161.131.43:80',
  '50.169.37.50:80',
  '50.174.145.11:80',
  '3.37.125.76:3128',
  '13.38.176.104:3128',
  '18.185.169.150:3128',
  '54.248.238.110:80',
  '13.37.89.201:3128',
  '50.170.90.29:80',
  '50.172.39.98:80',
  '50.172.218.164:80',
  '50.168.210.239:80',
  '50.168.210.236:80',
  '50.171.68.130:80',
  '50.174.7.162:80',
  '50.173.140.149:80',
  '50.174.7.154:80',
  '50.204.190.234:80',
  '50.168.163.178:80',
  '50.168.163.177:80',
  '50.218.57.74:80',
  '50.204.219.225:80',
  '50.239.72.18:80',
  '103.166.141.74:20074',
  '96.113.159.162:80',
  '50.204.219.230:80',
  '50.168.72.112:80',
  '50.204.219.224:80',
  '206.189.146.82:8888',
  '130.61.41.116:8888',
  '167.172.91.219:8000',
  '138.68.225.200:80',
  '195.158.18.236:3128',
  '20.78.102.191:80',
  '117.1.252.143:9002',
  '154.57.7.36:80',
  '188.166.56.246:80',
  '155.94.241.132:3128',
  '158.180.16.252:80',
  '58.234.116.197:80',
  '43.128.2.177:8080',
  '68.183.134.152:8000',
  '72.10.160.170:5385',
  '72.10.160.172:15991',
  '4.247.16.242:3128',
  '168.232.49.199:80',
  '67.43.227.226:25639',
  '200.174.198.95:8888',
  '136.244.99.51:8888',
  '45.11.95.165:5028',
  '36.92.193.189:80',
  '219.93.101.60:80',
  '195.114.209.50:80',
  '0.0.0.0:80',
  '82.165.105.48:80',
  '103.127.1.130:80',
  '50.172.75.122:80',
  '188.166.17.18:8881',
  '134.209.29.120:8080',
  '13.37.59.99:3128',
  '15.236.106.236:3128',
  '50.172.75.121:80',
  '211.128.96.206:80',
  '198.44.255.3:80',
  '50.172.75.126:80',
  '50.168.210.232:80',
  '3.122.84.99:3128',
  '50.172.75.123:80',
  '50.174.145.12:80',
  '84.39.112.144:3128',
  '87.107.166.3:8090',
  '50.174.7.152:80',
  '50.173.140.144:80',
  '50.231.110.26:80',
  '85.8.68.2:80',
  '50.235.240.86:80',
  '194.182.163.117:3128',
  '139.59.1.14:8080',
  '50.217.226.43:80',
  '50.170.90.31:80',
  '50.170.90.28:80',
  '50.170.90.25:80',
  '50.170.90.30:80',
  '50.231.104.58:80',
  '155.94.241.134:3128',
  '103.163.51.254:80',
  '154.65.39.7:80',
  '50.207.199.82:80',
  '20.206.106.192:80',
  '80.150.50.226:80',
  '50.170.90.34:80',
  '83.136.219.140:80',
  '50.217.226.40:80',
  '50.172.23.10:80',
  '50.169.135.10:80',
  '50.217.226.46:80',
  '127.0.0.7:80',
  '110.78.186.54:8080',
  '200.69.71.138:999',
  '94.154.152.109:8079',
  '218.255.187.60:80',
  '41.77.188.131:80',
  '51.75.206.209:80',
  '13.40.247.115:80',
  '102.130.125.86:80',
  '50.170.152.189:80',
  '50.168.72.119:80',
  '50.174.216.104:80',
  '50.172.75.125:80',
  '96.113.158.126:80',
  '50.174.214.222:80',
  '50.222.245.50:80',
  '43.250.107.223:80',
  '162.214.165.203:80',
  '139.162.78.109:3128',
  '50.204.219.226:80',
  '50.218.57.65:80',
  '47.88.3.19:8080',
  '51.15.242.202:8888',
  '50.218.57.70:80',
  '50.218.57.69:80',
  '50.204.219.231:80',
  '50.202.75.26:80',
  '50.174.7.155:80',
  '203.150.113.11:8080',
  '196.251.128.115:8080',
  '103.147.87.145:1981',
  '103.153.136.10:8080',
  '170.64.222.88:8000',
  '197.255.126.69:80',
  '50.168.72.122:80',
  '50.175.212.66:80',
  '50.169.118.211:80',
  '50.172.227.202:80',
  '50.174.145.15:80',
  '50.175.212.72:80',
  '50.200.12.81:80',
  '50.174.145.13:80',
  '50.200.12.85:80',
  '50.221.230.186:80',
  '50.222.245.46:80',
  '50.168.163.180:80',
  '24.205.201.186:80',
  '50.168.72.117:80',
  '50.218.57.68:80',
  '50.204.219.229:80',
  '207.2.120.16:80',
  '50.173.140.145:80',
  '50.221.74.130:80',
  '50.204.219.227:80',
  '50.239.72.16:80',
  '50.168.163.166:80',
  '198.176.56.43:80',
  '121.126.204.129:27600',
  '149.28.68.194:8888',
  '125.7.181.79:13864',
  '130.245.128.193:8080',
  '38.15.154.136:3128',
  '188.166.119.192:3128',
  '115.144.83.30:26811',
  '154.201.62.23:3128',
  '154.202.108.159:3128',
  '154.202.96.61:3128',
  '43.159.30.142:16379',
  '154.202.120.51:3128',
  '154.201.62.143:3128',
  '121.126.48.119:23040',
  '209.127.31.198:3128',
  '121.126.165.65:27389',
  '154.84.142.103:3128',
  '49.254.243.41:31023'
];
let currentProxyIndex = Math.floor(Math.random() * proxyUrls.length);

(async () => {
  puppeteerExtra.use(StealthPlugin());
  const browser = await puppeteerExtra.launch({ headless: false });
  const page = await browser.newPage();
  function getNextProxy() {
    const proxyUrl = proxyUrls[currentProxyIndex];
    currentProxyIndex = (currentProxyIndex + 1) % proxyUrls.length;
    return proxyUrl;
  }
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.resourceType() === 'document' || request.resourceType() === 'script') {
      const proxyUrl = getNextProxy();
      request.continue({ proxy: { server: proxyUrl } });
    } else {
      request.continue();
    }
  });
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  });
  await page.goto('https://cekdptonline.kpu.go.id/');
  // function connectToMySql() {
  //   const connection = mysql.createConnection({
  //     host: "localhost",
  //     user: "root",
  //     password: "",
  //     database: "dptonline",
  //   });
  //   return connection;
  // }
  function connectToMySql() {
    const connection = mysql.createConnection({
      host: "128.199.234.213",
      user: "sunan",
      password: "sunan02menang",
      database: "db",
    });
    return connection;
  }
  const connection = connectToMySql();
  connection.query("SELECT nik FROM dptonline WHERE nama IS NULL", async function (error, results) {
    if (error) {
      console.error("Error executing query:", error);
      return;
    }
    const totalData = results.length;
    let i = 0;

    for (const record of results) {
      i++;
      const { nik } = record;

      await page.goto("https://cekdptonline.kpu.go.id/");
      await page.focus("#__BVID__20");

      async function typeWithSpeed(text, speed) {
        for (const char of text) {
          await page.keyboard.type(char);
          await page.waitForTimeout(speed);
        }
      }
      await typeWithSpeed(nik, 100);
      await page.evaluate(() => {
        const buttons = document.querySelectorAll(".wizard-buttons .btn-primary");
        if (buttons.length > 1) {
          buttons[1].click();
        } else {
          console.error('The second button with class "btn-primary" was not found.');
        }
      });
      await page.waitForTimeout(3000);
      const bodyHandle = await page.$(".h-100");
      const htmlResponse = await page.evaluate((body) => body.innerHTML, bodyHandle);
      const { document } = new JSDOM(htmlResponse).window;
      try {
        const notFound = document.querySelector("h2.mb-2 b");
        if (notFound && notFound.textContent.trim() === "Data anda belum terdaftar!") {
          console.log("Tidak Terdaftar");
          const updateQuery = `UPDATE dptonline SET tps = "-", nama = "-", kecamatan = "-", kelurahan = "-" WHERE nik = ${nik}`;
          connection.query(updateQuery, (error) => {
            if (error) {
              console.error("Error updating record:", error);
              return;
            }
            console.log(`Record with NIK ${nik} updated Tidak Terdaftar!`);
          });
          continue;
        }

        const elTpsKelurahan = document.querySelectorAll(".row--right");
        const elKecamatan = document.querySelectorAll(".row--center");
        const elNama = document.querySelectorAll(".row .row-1 p");
        const tpsString = elTpsKelurahan[0].outerHTML;
        const namaString = elNama[0].outerHTML;
        const kelurahanString = elTpsKelurahan[2].outerHTML;
        const kecamatanString = elKecamatan[0].outerHTML;

        const matchTps = tpsString.match(/<p class="row--right".*?>(\d+)<\/p>/);
        const tps = matchTps ? matchTps[1] : null;

        const matchNama = namaString.match(/<p[^>]*><span>[^<]+<\/span>([^<]+)<\/p>/);
        const nama = matchNama ? matchNama[1].trim() : null;

        const matchKelurahan = kelurahanString.match(/<p class="row--right"><span>[^<]+<\/span>([^<]+)<\/p>/);
        const kelurahan = matchKelurahan ? matchKelurahan[1].trim() : null;

        const matchKecamatan = kecamatanString.match(/<p class="row--center"><span>[^<]+<\/span>([^<]+)<\/p>/);
        const kecamatan = matchKecamatan ? matchKecamatan[1].trim() : null;

        console.log(tps);
        console.log(nama);
        console.log(kelurahan);
        console.log(kecamatan);

        if (tps !== null) {
          const updateQuery = `UPDATE dptonline SET tps = '${tps}', nama = '${nama}', kecamatan = '${kecamatan}', kelurahan = '${kelurahan}' WHERE nik = ${nik}`;
          connection.query(updateQuery, (error) => {
            if (error) {
              console.error("Error updating record:", error);
              return;
            }
            console.log(`Record with NIK ${nik} updated successfully!`);
          });
        } else {
          console.log("Not Found");
        }

        if (i < totalData) {
          await page.evaluate(() => {
            const buttons = document.querySelectorAll(".wizard-buttons .btn-primary");
            buttons[0].click();
          });

          let searchInput;
          try {
            searchInput = await page.$("#__BVID__20");
            if (searchInput) {
              await searchInput.click();
            }
          } catch (error) {
            console.error("Error waiting for selector:", error);
          }

          if (searchInput) {
            for (let i = 0; i < 3; i++) {
              await searchInput.click();
            }
            await searchInput.press("Backspace");
          }
        } else {
          connection.end();
          await browser.close();
        }
      } catch (error) {
        console.log("skip");
        continue;
      }
    }
  });
})();
