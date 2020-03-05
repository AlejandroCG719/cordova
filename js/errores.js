var mensajeError = null;
function mostrarVentanaModal(codigoHTML)
{
  $('#divAvisos').html(sanitizarHTML(codigoHTML));
  miAplicacion.tab.show('#divViewAvisos', true);
}
function mostrarError(elError,estatusError,jqXHR)
{
  mensajeError = '<strong> Taza del Error' + idLlamada + '</strong> <br /> <br />';
  mensajeError += '<strong> Codigo de Apache:</strong>' + jqXHR.status + '' + jqXHR.statusText + '<br/>';
  estatusPeticion(jqXHR);
  switch (elError.code) {
    case -32000:
      mensajeError += elError.message;
      break;
    case -32600:
      mensajeError += 'Peticion invalida';
      break;
    case -326001:
      mensajeError += 'El metodo en el servicioo web:<br /> No se encontro';
      break;
    case -326002:
      mensajeError += 'Paramentros  invalidos.';
      break;
    case -326003:
      mensajeError += 'Error  interno.';
      break;
    case -327000:
      mensajeError += 'Error  sintaxis.';
      break;
      default:
     mensajeError += 'Error ' + elError.code + ': <br />' + elError.message;
     break;
  }
  console.log(jqXHR.responseJSON.error.message);
  mostrarVentanaModal(mensajeError);
}
function mostrarErrorJSON(jqXHR, estatusError, textoError)
{
  mensajeError = '<strong>Traza del error ' + idLlamada + '</strong> <br /> <br />';
  mensajeError += '<strong>Codigo de apache :</strong>' + jqXHR.status + ' ' + jqXHR.statusText + '<br/>';
  estatusPeticion(jqXHR);
  console.log(jqXHR);
    switch ($.trim(estatusError)){
      case 'timeout' :
        mensajeError += 'El tiempo de espera, sea agoto. <br /> Probablemente, existen intermitencias en su conexion a internet.';
      break;
      case 'error':
        mensajeError += 'se recibio una respuesta';
        break;
      case 'abort':
        mensajeError += 'su nacegador aborto la conexion al servidor';
        break;
      case 'parsererrror':
        mensajeError += 'Se recibio una respuesta pero es corrupta';
        break;
      default:
        mensajeError += 'Error desconocido: ' + $.trim(estatusError) + ': <br />' + textoError;
        break;
    }
    console.log(jqXHR.responseText);
    mostrarVentanaModal(mensajeError);
}

function estatusPeticion(jqXHR)
{
  switch (jqXHR.readyState) {
    case 0:
      mensajeError += '<strong> Estado: </strong> Peticion no completa (readyState:0)<br />';
      break;
    case 1:
      mensajeError += '<strong> Estado: </strong> Conexion sise establecio (readyState:1)<br />';
      break;
    case 2:
      mensajeError += '<strong> Estado: </strong> Peticion si se recibio (readyState:2)<br />';
      break;
    case 3:
      mensajeError += '<strong> Estado: </strong> Peticion en procesamiento (readyState:3)<br />';
      break;
    case 4:
      mensajeError += '<strong> Estado: </strong> Peticion finalizada y con respuesta(readyState:4)<br />';
      break;
    default:
    mensajeError += '<strong> Estado: </strong> Error desconocido (readyState:' + jqXHR.readyState + ')<br />';
  }
  mensajeError += '<br />';
}
