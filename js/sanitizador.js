var htmlNuevo = null;

var htmlSanitizado = null;

var indice = null;

function sanitizarHTML(codigoHTML)
{
  htmlSanitizado = codigoHTML;
  if (window.toStaticHTML) {
    htmlSanitizado = window.toStaticHTML(htmlSanitizado);
  }
  return htmlSanitizado;
}
