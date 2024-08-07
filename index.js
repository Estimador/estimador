const express = require('express');
const rutasProvincia = require('./ProvinciaRad/rutasProvincia');
const rutasCotizar = require('./Cotizar/rutasCotizar');

const app = express();
const port = process.env.PORT || 3000; 

//testeos para provincia 
 
app.use('/', rutasProvincia);
app.use('/', rutasCotizar);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
