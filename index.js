const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();
const port = 3000;

app.get('/consulta', async (req, res) => {
  const { patente, provincia, valorDeclarado } = req.query;

  if (!patente || !provincia || !valorDeclarado) {
    return res.status(400).json({ error: 'Patente, provincia y valor declarado son requeridos' });
  }

  try {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setJavaScriptEnabled(true);

    await page.goto('https://www2.jus.gov.ar/dnrpa-site/#!/estimador', { waitUntil: 'networkidle0' });

    await page.waitForSelector('#codigoTramite', { timeout: 60000 });
    await page.select('#codigoTramite', 'string:08xxxx'); // Selecciona "TRANSFERENCIA"

    await page.waitForSelector('input#dominio', { visible: true });
    await page.waitForSelector('input[name="valorDeclarado"]', { visible: true });
    await page.waitForSelector('#codigoProvincia', { visible: true });

    await page.type('input#dominio', patente);
    await page.type('input[name="valorDeclarado"]', valorDeclarado);
    await page.select('#codigoProvincia', `string:${provincia}`);

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await page.waitForSelector('.container-fluid.margin-20', { timeout: 60000 });

    const result = await page.evaluate(() => {
      const items = document.querySelectorAll('div[ng-repeat="item in presupuestoCtrl.presupuesto.DetallePrecioPrecargaViewModel"]');
      const data = Array.from(items).map(item => {
        const descriptionElem = item.querySelector('.col-xs-6.col-sm-5');
        const priceElem = item.querySelector('.col-xs-2.col-sm-2.text-right');
        const quantityElem = item.querySelector('.col-xs-2.col-sm-2.text-right');
        const totalElem = item.querySelector('.col-xs-2.col-sm-2.text-right');

        return {
          description: descriptionElem ? descriptionElem.innerText.trim() : null,
          price: priceElem ? priceElem.innerText.trim() : null,
          quantity: quantityElem ? quantityElem.innerText.trim() : null,
          total: totalElem ? totalElem.innerText.trim() : null,
        };
      });

      const totalPriceElem = document.querySelector('.container-fluid.margin-20 .row.alert-info.presupuesto-row .col-xs-12.text-right strong.ng-binding');
      const totalPrice = totalPriceElem ? totalPriceElem.innerText.trim() : null;

      return {
        items: data,
        totalPrice: totalPrice
      };
    });

    await browser.close();

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar los datos' });
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
