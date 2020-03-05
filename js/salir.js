var marcaTiempo = new Date().getTime();

$(document).ready(
  function () {
    $$ = Dom7;
    miAplicacion = new Framework7({
      id : 'mx.com.alejandro.system',
      root : '#app',
      theme : tema,
      name : 'Mi app'
    });
    viewPrincipal = miAplicacion.views.create('.view-main');
  }
);
function accederOtraVez()
{
  document.location.replace('index.html');
}
function volver(){
  miAplicacion.tab.show('#divViewLogin');
}
