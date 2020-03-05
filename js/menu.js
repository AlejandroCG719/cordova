var marcaTiempo = new Date().getTime();
var jsonRespuesta = null;
var peticionJSON = null;
const GATEWAY_SALIR = '../zend_gateway/index.php';
const CLASE_SALIR = 'Salir';

$(document).ready(
  function () {
    $$ = Dom7;
    miAplicacion = new Framework7({
      id : 'mx.com.alejandro.system',
      root : '#app',
      theme : tema,
      name : 'Mi App'
    });
    viewPrincipal = miAplicacion.views.create('.view-main');
  }
);

function cerrarAplicacion() {
  peticionJSON = JSON.stringify(
    {
    'Id' : generarID(),
    'method' : 'terminarSesion',
    'clase' : CLASE_SALIR,
  });
  $.ajax({
    method : 'POST',
    timeout : 30000,
    data : peticionJSON,
    datatype : 'json',
    url : GATEWAY_SALIR,
    success : function (jsonRespuesta, estatusRespuesta, jqXHR)
    {
      exitoCerrarAplicacion(jsonRespuesta, estatusRespuesta, jqXHR);
    },
    error : function (jqXHR, estatusError, textoError)
    {
      mostrarErrorJSON(jqXHR, estatusError, textoError);
    }
  });
}
function exitoCerrarAplicacion(jsonRespuesta, estatusRespuesta, jqXHR)
{
  if(jsonRespuesta.error){
    traerValidacion();
    mostrarError(jsonRespuesta.error,estatusRespuesta, jqXHR);
    return;
  }
  if ((jsonRespuesta.result).toString().length === 40) {
    document.location.replace('salir.html');
    return;
  }else {
    mostrarVentanaModal('La respuesta noes de confiar')
  }
}
function cargarOpcion(quePagina)
{
  switch (quePagina) {
    case 'paises' :
      document.location.replace('paises.html');
      break;
    case 'estados' :
      document.location.replace('estados.html');
      break;
    case 'algo':
      document.location.replace('algo.html');
      break;
    default:
      mostrarVentanaModal('No selecciono una opcion de  menu valida');
      break;
  }
}
function volver() {
  miAplicacion.tab.show('#divViewLogin');
}
