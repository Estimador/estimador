const express = require('express');
const { chromium } = require('playwright');

const app = express();
const port = process.env.PORT || 3000;

app.get('/consulta', async (req, res) => {
  const { patente, provincia, valorDeclarado } = req.query;

  if (!patente || !provincia || !valorDeclarado) {
    return res.status(400).json({ error: 'Patente, provincia y valor declarado son requeridos' });
  }

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      bypassCSP: true
    });

    const page = await context.newPage();

    // Ir a la página del estimador
    await page.goto('https://www2.jus.gov.ar/dnrpa-site/#!/estimador', { waitUntil: 'networkidle' });

    // Esperar a que el selector #codigoTramite esté presente y visible
    await page.waitForSelector('#codigoTramite', { state: 'visible' });

    // Seleccionar la opción "TRANSFERENCIA" por su valor
    await page.selectOption('#codigoTramite', 'string:08xxxx');

    // Llenar los campos del formulario
    await page.fill('input#dominio', patente);
    await page.fill('input[name="valorDeclarado"]', valorDeclarado);
    await page.selectOption('#codigoProvincia', 'string:' + provincia);

    // Hacer clic en el botón de enviar y esperar la navegación
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle' }),
    ]);

    // Esperar a que se cargue la información del presupuesto
    await page.waitForSelector('.container-fluid.margin-20', { timeout: 60000 });

    // Extraer y devolver los resultados
    const result = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div[ng-repeat="item in presupuestoCtrl.presupuesto.DetallePrecioPrecargaViewModel"]')).map(item => ({
        description: item.querySelector('.col-xs-6.col-sm-5')?.innerText.trim() || null,
        price: item.querySelector('.col-xs-2.col-sm-2.text-right')?.innerText.trim() || null,
        quantity: item.querySelector('.col-xs-2.col-sm-2.text-right')?.innerText.trim() || null,
        total: item.querySelector('.col-xs-2.col-sm-2.text-right')?.innerText.trim() || null,
      }));

      const totalPrice = document.querySelector('.container-fluid.margin-20 .row.alert-info.presupuesto-row .col-xs-12.text-right strong.ng-binding')?.innerText.trim() || null;

      return { items, totalPrice };
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
