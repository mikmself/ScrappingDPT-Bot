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
  '23.229.110.4:8532'
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
  function connectToMySql() {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "dptonline",
    });
    return connection;
  }
  // function connectToMySql() {
  //   const connection = mysql.createConnection({
  //     host: "128.199.234.213",
  //     user: "sunan",
  //     password: "sunan02menang",
  //     database: "db",
  //   });
  //   return connection;
  // }
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
