/**
 * JS Aplicacion, para mostrar  y dar tratmiento a errores
 *Softw
*/
/*var marcaTiempo = new Date().getTime();
var jsonRespuesta = null;*/
var usuario = null;
var contrasena = null;
var validacion = null;
var peticionJSON = null;
const GATEWAY_ACCESO = '../zend_gateway/index.php';
const CLASE_ACCESO ='Acceso';
$(document).ready(
  function() {
    $$ = Dom7;
    miAplicacion = new Framework7({
      id:'mx.com.alejandro.system',
      root:'#app',
      theme : tema,
      name: 'Mi App'
    });
    ViewPrincipal = miAplicacion.views.create('.view-main');
    traerValidacion();
  }
);
function traerValidacion()
{
  peticionJSON = JSON.stringify(
  {
    'Id' : generarID(),
    'method' : 'traerValidacion',
    'clase' : CLASE_ACCESO
  });

  $.ajax({
    method : 'POST',
    timeout : 30000,
    data : peticionJSON,
    dataType : 'json',
    url : GATEWAY_ACCESO,
    success : function (jsonRespuesta,estatusRespuesta, jqXHR)
    {
      exitoTraerValidacion(jsonRespuesta,estatusRespuesta, jqXHR);
    },
    error : function (jqXHR,estatusError, textoError)
    {
 /*     console.log(jqXHR);
      console.log(estatusError);
      console.log(textoError);*/
      mostrarErrorJSON(jqXHR,estatusError, textoError);
    }
  });
}

function exitoTraerValidacion(jsonRespuesta, estatusRespuesta, jqXHR)
{
  if (jsonRespuesta.error) {
    mostrarErrorJSON(jsonRespuesta.error, estatusRespuesta, jqXHR);
      return;
  }
  validacion = jsonRespuesta.result.split('');
  validacion = validacion.join('&nbsp;');
  $('#strongValidacion').html(validacion);
  $('#inputValidacion').val('');
}
function verificarDatos()
{
  //miAplicacion.tab.show('#divViewAvisos',true)
  usuario = $('#inputUsuario').val().toString().trim();
  contrasena = $('#inputContrasena').val().toString().trim();
  validacion = $('#inputValidacion').val().toString().trim();

  if (usuario.length > 0 && contrasena.length > 0 && validacion.length == 4){
     verificar();
  }else {
    mostrarVentanaModal('Revisa tu datos antes de enviar');
  }
}
function verificar()
{
  peticionJSON = JSON.stringify(
    {
      'Id' : generarID(),
      'method' : 'verificarAcceso',
      'clase' : CLASE_ACCESO,
      'Params' : [usuario , contrasena, validacion]
    });
    $.ajax({
      method : 'POST',
      timeout : 30000,
      data : peticionJSON,
      dataType : 'json',
      url : GATEWAY_ACCESO,
      success : function (jsonRespuesta,estatusRespuesta, jqXHR)
      {
        exitoVerificarAcceso(jsonRespuesta,estatusRespuesta, jqXHR);
      },
      error : function (jqXHR,estatusError, textoError)
      {
        mostrarErrorJSON(jqXHR,estatusError, textoError);
      }
    });
}
function exitoVerificarAcceso(jsonRespuesta,estatusRespuesta,jqXHR)
{
  $('#inputUsuario').val('');
  $('#inputContrasena').val('');
  $('#inputValidacion').val('');
  if (jsonRespuesta.error) {
    traerValidacion();
    mostrarError(jsonRespuesta.error, estatusRespuesta, jqXHR);
  }
  if ((jsonRespuesta.result).toString().length == 40){
      document.location.replace('menu.html');
      return;
  }else {
    traerValidacion();
    mostrarVentanaModal('La respuesta no es de confiar')
  }
}
function volver()
{
  miAplicacion.tab.show('#divViewLogin');
}
