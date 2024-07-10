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
    console.log('Iniciando el navegador...');
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log('Creando nuevo contexto...');
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      bypassCSP: true
    });

    console.log('Creando nueva página...');
    const page = await context.newPage();

    console.log('Navegando a la página del estimador...');
    await page.goto('https://www2.jus.gov.ar/dnrpa-site/#!/estimador', { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Página cargada');

    console.log('Esperando selector #codigoTramite...');
    await page.waitForSelector('#codigoTramite', { state: 'visible', timeout: 60000 });
    console.log('Selector #codigoTramite encontrado');

    console.log('Seleccionando opción "TRANSFERENCIA"...');
    await page.selectOption('#codigoTramite', 'string:08xxxx');

    console.log('Llenando campos del formulario...');
    await page.fill('input#dominio', patente);
    await page.fill('input[name="valorDeclarado"]', valorDeclarado);
    await page.selectOption('#codigoProvincia', 'string:' + provincia);

    console.log('Enviando formulario...');
    await page.click('button[type="submit"]');

    console.log('Esperando resultados...');
    await page.waitForSelector('.container-fluid.margin-20', { timeout: 60000 });
    console.log('Resultados cargados');

    console.log('Extrayendo resultados...');
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

    console.log('Cerrando navegador...');
    await browser.close();

    console.log('Enviando respuesta...');
    res.json(result);
  } catch (error) {
    console.error('Error durante la consulta:', error);
    if (error.name === 'TimeoutError') {
      res.status(504).json({ error: 'Tiempo de espera excedido al cargar la página' });
    } else {
      res.status(500).json({ error: 'Error al consultar los datos' });
    }
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
