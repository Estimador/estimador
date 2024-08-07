function provincia(data) { 
    const startDelimiter = "Provincia. </font><font face='Arial' color = #000000 size = 2>  ";
    const endDelimiter = "</td>";  
    const startIndex = data.indexOf(startDelimiter);
    const endIndex = data.indexOf(endDelimiter, startIndex);  

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        // Ajustar los índices para extraer el texto
        const wordStart = startIndex + startDelimiter.length;
        const wordEnd = endIndex; 
        const word = data.substring(wordStart, wordEnd).trim();        
        console.log("La palabra encontrada es:", word);
        return word;
    } else {
        console.log("No se encontró la palabra entre los delimitadores.");
    }
}
 


function tipo(data) {
    const startDelimiter = "Tipo de Veh&iacute;culo</b>. <font face='Arial' size='2' color = '#000000'>";
    const endDelimiter = "</font>";   
    const startIndex = data.indexOf(startDelimiter);
    const endIndex = data.indexOf(endDelimiter, startIndex); 
    
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) { 
        const wordStart = startIndex + startDelimiter.length;
        const wordEnd = endIndex; 
        const word = data.substring(wordStart, wordEnd).trim();      
        console.log("Tipo de Vehículo encontrado es:", word);
        return word;
    } else {
        console.log("No se encontró el Tipo de Vehículo entre los delimitadores.");
    }
}
 
function registro(data) {
    const startDelimiter = "Registro Seccional. </font><font face='Arial' color = #000000 size = 2>  ";
    const endDelimiter = "</font>";

    const startIndex = data.indexOf(startDelimiter);
    const endIndex = data.indexOf(endDelimiter, startIndex + startDelimiter.length)-109; 
    console.log("Substring Between Indices:", data.substring(startIndex, endIndex));

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const wordStart = startIndex + startDelimiter.length;
        const wordEnd = endIndex;
        const word = data.substring(wordStart, wordEnd).trim();
        console.log("Registro Seccional encontrado es:", word);
        return word.replace("N&deg;"," N°");
    } else {
        console.log("No se encontró el Registro Seccional entre los delimitadores.");
    }
}





function direccion(data){
    const startDelimiter = "Direcci&oacute;n. </font><font face='Arial' color = #000000 size = 2> ";
    const endDelimiter =";Localidad."; 
    const startIndex = data.indexOf(startDelimiter) + startDelimiter.length;
    const endIndex = data.indexOf(endDelimiter); 
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const word = data.substring(startIndex, endIndex-207).trim();      
        console.log("La palabra encontrada es:", word);
        return word;
    } else {
        console.log("No se encontró la palabra entre los delimitadores.");
    }
}

function localidad(data){
    const startDelimiter = "Localidad. </font><font face='Arial' color = #000000 size = 2>  ";
    const endDelimiter ="Provincia."; 
    const startIndex = data.indexOf(startDelimiter) + startDelimiter.length;
    const endIndex = data.indexOf(endDelimiter); 
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const word = data.substring(startIndex, endIndex-95).trim();      
        console.log("La palabra encontrada es:", word);
        return word;
    } else {
        console.log("No se encontró la palabra entre los delimitadores.");
    }
}

function cp(data){
    const startDelimiter = "Postal. </font><font face='Arial' color = #000000 size = 2>  ";
    const endDelimiter ="Tel&oacute;fono. "; 
    const startIndex = data.indexOf(startDelimiter) + startDelimiter.length;
    const endIndex = data.indexOf(endDelimiter); 
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const word = data.substring(startIndex, endIndex-95).trim();      
        console.log("La palabra encontrada es:", word);
        return word;
    } else {
        console.log("No se encontró la palabra entre los delimitadores.");
    }
}


function telefono(data){
    const startDelimiter = "Tel&oacute;fono. ";
    const endDelimiter ="** El horario de at"; 
    const startIndex = data.indexOf(startDelimiter) + startDelimiter.length;
    const endIndex = data.indexOf(endDelimiter); 
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const word = data.substring(startIndex+53, endIndex-219).trim();      
        console.log("La palabra encontrada es:", word);
        return word;
    } else {
        console.log("No se encontró la palabra entre los delimitadores.");
    }
}


module.exports = { provincia, tipo, registro, direccion, localidad, cp, telefono };