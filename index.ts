const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const jsdom = require("jsdom");
const mysql = require("mysql");
const { JSDOM } = jsdom;

const proxyUrls = [
  '117.54.114.97:80',
  '103.23.102.1:4145',
  '36.92.96.179:5678',
  '103.36.11.158:4145',
  '110.139.128.232:4145',
  '49.0.2.243:5430',
  '103.233.103.237:4153',
  '36.95.245.81:5678',
  '111.68.31.134:40385',
  '36.64.238.82:1080',
  '202.162.212.164:4153',
  '112.78.39.94:4153',
  '180.178.104.106:5678',
  '203.160.61.103:4145',
  '103.36.35.254:5678',
  '117.102.115.154:4153',
  '202.154.19.45:1080',
  '103.76.172.230:4153',
  '36.93.217.163:5678',
  '36.95.48.45:1080',
  '43.248.25.6:4145',
  '43.133.136.208:8800',
  '117.74.125.210:1133',
  '117.102.85.163:55435',
  '117.74.120.128:1133',
  '202.180.20.114:1080',
  '180.250.159.49:4153',
  '203.153.125.13:65424',
  '121.101.131.44:8080',
  '203.160.61.101:4145',
  '36.92.125.163:1080',
  '202.150.148.1:4145',
  '43.252.237.98:4145',
  '202.162.219.10:1080',
  '202.145.11.217:5678'
];

function getRandomUserAgent() {
  const uaList = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.3059.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
  ];

  const randomIndex = Math.floor(Math.random() * uaList.length);
  return uaList[randomIndex];
}

(async () => {
  puppeteerExtra.use(StealthPlugin());
  const browser = await puppeteerExtra.launch({ headless: false });
  const page = await browser.newPage();

  async function getRandomProxy() {
    const index = Math.floor(Math.random() * proxyUrls.length);
    const proxyUrl = proxyUrls[index];
    return proxyUrl;
  }

  async function navigate(url) {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForTimeout(5000 + Math.random() * 5000);
    await page.setUserAgent(getRandomUserAgent());
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    const proxyUrl = await getRandomProxy();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.resourceType() === 'document' || request.resourceType() === 'script') {
        request.continue({ proxy: { server: proxyUrl } });
      } else {
        request.continue();
      }
    });
  }
  async function typeWithSpeed(text, speed) {
    for (const char of text) {
      await page.keyboard.type(char);
      await page.waitForTimeout(speed);
    }
  }

  async function handleCaptcha(nik) {
    console.log("CAPTCHA Detected for NIK:", nik);
  }

  await navigate('https://cekdptonline.kpu.go.id/');

  // function connectToMySql() {
  //   const connection = mysql.createConnection({
  //     host: "128.199.234.213",
  //     user: "sunan",
  //     password: "sunan02menang",
  //     database: "db",
  //   });
  //   return connection;
  //  }
  function connectToMySql() {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "dptonline",
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
        if (error.message.includes('CAPTCHA')) {
          handleCaptcha(nik);
          break;
        }
        console.log("skip");
        continue;
      }
    }
  });
})();
