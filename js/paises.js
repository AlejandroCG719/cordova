var marcaTiempo= new Date().getTime();

var jsonRespuesta = null;

var peticionJSON = null;

var jsonPaises = null;

var objetoPais = null;

var accion = null;

var columnaBusqueda = null;

var criterioBusqueda = null;

const GATEWAY_PAISES = '../zend_gateway/index.php';

const CLASE_PAISES = 'Paises';

$(document).ready(
    function () {
        $$ = Dom7;
        miAplicacion = new Framework7({
            id: 'mx.com.alejandro.system',
            root: '#app',
            theme: tema,
            name: 'Mi App'
        });
        viewPrincipal = miAplicacion.views.create('.view-main');
        listarPaises();
    }
);
function listarPaises()
{
    peticionJSON = JSON.stringify(
{
        'Id' : generarID(),
        'method' : 'listar',
        'clase' : CLASE_PAISES,
        'Params' : ['2']
    });
    accion = 'listar';
    $.ajax({
        method: 'POST',
        timeout : 30000,
        data : peticionJSON,
        datatype : 'json',
        url : GATEWAY_PAISES,
        success : function (jsonRespuesta,estatusRespuesta, jqXHR)
        {
            exitoListarPaises(jsonRespuesta, estatusRespuesta, jqXHR);
        },
        error: function (jqXHR, estatusError, textoError)
        {
            mostrarErrorJSON(jqXHR, estatusError, textoError);
        }
    });
}

/**
 * Funcion Listener para listar los paises mediante AJAX.
 * @param {objet} jsonRespuesta
 * @param {string} estatusRespuesta
 * @param {object}jqXHR
 * @returns {void}
 */
function exitoListarPaises(jsonRespuesta, estatusRespuesta, jqXHR)
{
    if (jsonRespuesta.error){
        mostrarError(jsonRespuesta.error, estatusRespuesta, jqXHR);
        return;
    }
    indice = 1;
    jsonPaises = jsonRespuesta.result;
    console.log(jsonRespuesta);
    $('#ulPaises > li').remove();
    if (jsonPaises.length != 0){
        htmlNuevo = '';
        for ( indice=0; indice<jsonPaises.length; indice++){
            objetoPais= jsonPaises[indice];
            htmlNuevo += '<li>';
                htmlNuevo += '<a href="javascript: seleccionoRegistro('+ indice + ');" class="item-link item-content">';
                htmlNuevo += '<div class="item-media">';
                htmlNuevo += '<i class="f7-icons ios-only">book</i>';
                htmlNuevo += '<i class="material-icons md-only">book</i>';
                htmlNuevo += '</div>';
                htmlNuevo += '<div class="item-inner">';
                htmlNuevo += '<div class="item-title">';
                htmlNuevo += '<div class="item-header">' + objetoPais.a + '</div>';
                htmlNuevo += objetoPais.b;
                htmlNuevo += '</div>';
                htmlNuevo += '</div>';
                htmlNuevo += '</a>';
            htmlNuevo += '</li>';
        }
        $('#ulPaises').append(sanitizarHTML(htmlNuevo) );
    }else{
        mostrarVentanaModal('No hay paises');
    }
}
function seleccionoRegistro(posicioArray)
{
    objetoPais = jsonPaises[posicioArray];
    miAplicacion.panel.close('divPanelDerecho');
    miAplicacion.tab.show('#divViewDetalle',true);
    $('#divBotonBorrar').show();
    $('#inputID').val(objetoPais.a);
    $('#inputNombre').val(objetoPais.b);
    $('#inputISO2').val(objetoPais.c);
    $('#divTituloFormulario').html( sanitizarHTML('Editar un Pais') );
}
function agregarPais()
{
    objetoPais = null;
    miAplicacion.panel.close('divPanelrDerecho');
    miAplicacion.tab.show('#divViewDetalle',true);
    $('#divBotonBorrar').hide();
    $('#inputID').val('0');
    $('#inputNombre').val('');
    $('#inputISO2').val('');
    $('#divTituloFormulario').html( sanitizarHTML('Crear un Pais') );
}
function guardarPais()
{
    objetoPais = {
        a : $('#inputID').val(),
        b : $('#inputNombre').val().toString().trim(),
        c : $('#inputISO2').val().toString().trim()
    };
    if (objetoPais.a == 0){
        accion = 'insertar';
    }else{
        accion = 'actualizar';
    }
    if (objetoPais.b.length <= 0 || objetoPais.c.length <= 0){
        mostrarVentanaModal('Faltan Datos');
        return;
    }
    peticionJSON = JSON.stringify(
{
        'Id' : generarID(),
        'method' : accion,
        'clase' : CLASE_PAISES,
        'Params' : [objetoPais]
    });
    $.ajax({
        method : 'POST',
        timeout : 30000,
        data : peticionJSON,
        datatype : 'json',
        url : GATEWAY_PAISES,
        success : function (jsonRespuesta, estatusRespuesta, jqXHR)
        {
            exitoGuardadoPais(jsonRespuesta, estatusRespuesta, jqXHR);
        },
        error : function (jqXHR, estatusError, textoError)
        {
            mostrarErrorJSON(jqXHR, estatusError, textoError);
        }
    });
}
function exitoGuardadoPais(jsonRespuesta, estatusRespuesta, jqXHR)
{
    if (jsonRespuesta.error){
        mostrarError(jsonRespuesta.error, estatusRespuesta, jqXHR);
        return;
    }
    switch (accion) {
        case 'insertar':
            if (jsonRespuesta.result > 0){
                mostrarVentanaModal('Pais Insertado con el ID ' +jsonRespuesta.result);
            }else{
                mostrarVentanaModal('No se pudo insertar el Pais');
            }
        break;
        case 'actualizar':
            if (jsonRespuesta.result == 1){
                mostrarVentanaModal('Pais ' + objetoPais.a + 'Actualizado');
            }else{
                mostrarVentanaModal('No se pudo actualizar el Pais');
            }
        break;
        default:
            mostrarVentanaModal('Tipo de respuesta no definido');
        break;
    }
    mostrarListado();
}
function mostrarBusqueda()
{
    miAplicacion.panel.close('divPanelDerecho');
    miAplicacion.tab.show('#divViewBusquedas',true);
    $('#inputCriterio').val('');
    $('#selectColumna').val(0).attr('selected','selected');
}
function buscarPais()
{
    columBusqueda = $('#selectColumna').val();
    criterioBusqueda = $('#inputCriterio').val().toString().trim();
    if (criterioBusqueda.length <= 0){
        mostrarVentanaModal('Falta el criterio de Busqueda');
        return;
    }
    accion = 'buscar';
    peticionJSON = JSON.stringify(
{
       'Id' : generarID(),
        'method' : 'buscar',
        'clase' : CLASE_PAISES,
        'Params' : [criterioBusqueda,columBusqueda,'2']
    });
    $.ajax({
        method : 'POST',
        timeout : 30000,
        data : peticionJSON,
        dataType : 'json',
        url : GATEWAY_PAISES,
        success : function (jsonRespuesta, estatusRespuesta, jqXHR)
        {
            exitoListarPaises(jsonRespuesta, estatusRespuesta, jqXHR);
        },
        error : function (jqXHR, estatusError, textoError)
        {
            mostrarErrorJSON(jqXHR, estatusError, textoError);
        }
    });
    miAplicacion.tab.show('#divViewListado', true);
}
function confirmarBorrado()
{
    if (objetoPais == null){
        mostrarVentanaModal('Ese pais No se puede borrar...');
    }
    miAplicacion.panel.close('divPanelDerecho');
    miAplicacion.tab.show('#divViewBorrado',true);
    htmlNuevo = 'ID : <strong>' + objetoPais.a +
        '</strong><br>Nombre: <strong>' + objetoPais.b +
        '</strong><br>ISO 2: <strong>'+ objetoPais.c +
        '</strong>';
    $('#pDatosPais').html( sanitizarHTML(htmlNuevo) );
}
function borrarPais()
{
    objetoPais = { a: objetoPais.a};
    peticionJSON = JSON.stringify({
        'Id' : generarID(),
        'method' : 'borrar',
        'clase' : CLASE_PAISES,
        'Params' : [objetoPais]
    });
    $.ajax({
        method : 'POST',
        timeout : 30000,
        data : peticionJSON,
        dataType : 'json',
        url : GATEWAY_PAISES,
        success : function (jsonRespuesta, estatusRespuesta, jqXHR)
        {
            exitoBorradoPais(jsonRespuesta, estatusRespuesta, jqXHR);
        },
        error : function (jqXHR, estatusError, textoError)
        {
            mostrarErrorJSON(jqXHR, estatusError, textoError);
        }
    });
}
function exitoBorradoPais(jsonRespuesta, estatusRespuesta, jqXHR)
{
    if (jsonRespuesta.error){
        mostrarError(jsonRespuesta.error, estatusRespuesta, jqXHR);
        return;
    }
    if (jsonRespuesta.result == 1){
        mostrarVentanaModal('Pais ' + objetoPais.a + 'Borrado<br /> (Recuerde : Este borrado no se puede deshacer).');
    }else{
        mostrarVentanaModal('El Pais ' + objetoPais.a + 'NO pudo ser borrado.');
    }
    mostrarListado();
}
function crearPDF() {
    miAplicacion.panel.close('divPanelDerecho');
    peticionJSON = JSON.stringify({
        'Id' : generarID(),
        'methos' : 'reportePDF',
        'clase' : CLASE_PAISES,
        'Params' : [accion, criterioBusqueda, columnaBusqueda]
    });
    $.ajax({
        method : 'POST',
        timeout : 30000,
        data : peticionJSON,
        dataType : 'json',
        url : GATEWAY_PAISES,
        success : function (jsonRespuesta, estatusRespuesta, jqXHR)
        {
            exitoCrearPDF(jsonRespuesta, estatusRespuesta, jqXHR);
        },
        error : function (jqXHR, estatusError, textoError)
        {
            mostrarErrorJSON(jqXHR, estatusError, textoError);
        }
    });
}
function exitoCrearPDF(jsonRespuesta, estatusRespuesta, jqXHR)
{
    if (jsonRespuesta.error){
        mostrarError(jsonRespuesta.error, estatusRespuesta, jqXHR);
        return;
    }
    if (jsonRespuesta.result != '' && (jsonRespuesta.result.substr(jsonRespuesta.result.length - 4) == '.pdf') ){
        var urlPDF = '../pdfs/'+ jsonRespuesta.result;
        if (window.toStaticHTML){
            //
        }else {
            window.open(urlPDF, '_blank');
        }
        mostrarVentanaModal('El PDF, no pudo ser creado');
    }
}
function mostrarListado()
{
    miAplicacion.panel.close('divPanelDerecho');
    miAplicacion.tab.show('#divViewListado', true);
    listarPaises();
}
function irMenu() {
    document.location.replace('menu.html');
}