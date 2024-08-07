const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router(); 
 
//testear cotizacion https://www.autocosmos.com.ar/guiadeprecios?Marca=audi&Modelo=a3&A=2020
// Ruta para obtener cotización basada en marca, modelo y año  
router.get('/cotizar/:marca/:modelo/:ano', async (req, res) => {
    try {
        const { marca, modelo, ano } = req.params;

        // URL del servicio o página web para hacer scraping
        const url = `https://www.autocosmos.com.ar/guiadeprecios?Marca=${marca}&Modelo=${modelo}&A=${ano}`;

        // Hacer la solicitud HTTP para obtener la página
        const response = await axios.get(url);

        // Cargar el contenido HTML con cheerio
        const $ = cheerio.load(response.data);

        // Extraer los datos de cada fila en la tabla
        const resultados = [];

        $('tbody tr').each((index, element) => {
            const version = $(element).find('td[itemprop="name"] span').text().trim();
            const precio = $(element).find('td[style="text-align:right;"]').text().trim();

            // Extraer el precio limpio (eliminando caracteres no numéricos)
            const cleanedPrice = parseFloat(precio.replace(/[^0-9]/g, ''));

            // Incrementar el precio en un 15%
            const incrementedPrice = cleanedPrice * 1.15;

            // Formatear el precio incrementado con comas
            const formattedPrice = incrementedPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

            resultados.push({
                version,
                precio: formattedPrice
            });
        });

        // Enviar los resultados como respuesta
        res.json(resultados);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener los datos de cotización' });
    }
});

module.exports = router;
 