const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();
const { provincia, tipo, registro, direccion, localidad, cp, telefono } = require('./func-scrap-prov');
 

router.get('/getVehicleInfo/:dominio', async (req, res) => {
    try {
        const { dominio } = req.params;
        const response = await axios.post('https://www.dnrpa.gov.ar/portal_dnrpa/radicacion/consinve_amq.php',
            new URLSearchParams({ dominio }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const $ = cheerio.load(response.data);
        console.log(response.data);




        // Ajustar selectores para capturar texto de los elementos correctamente
        const data = {
            provincia: provincia(response.data),
            dominio: req.params.dominio,
            tipoVehiculo: tipo(response.data),
            registro: registro(response.data),
            direccion: direccion(response.data),
            localidad: localidad(response.data),
            codigoPostal: cp(response.data),
            telefono: telefono(response.data),
        };

        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener los datos del vehículo' });
    }
});

module.exports = router;