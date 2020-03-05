<?php
date_default_timezone_set('America/Mexico_City');
define('PRODUCCION', false); // TRUE: No mostrara la "rajita de canela", FALSE:Si las mostrara...! o.O
define('HOY', date('Y') . "-" . date('m') . "-" . date('d'));
define('HORA', date('H') . ":" . date('i') . ":" . date('s'));

if(PRODUCCION) {
	// Reservados para PRODUCCION, cambiar por los del Servidor "en la nube".
	define('SERVIDOR', 'p:127.0.0.1');
	define('USUARIO', '');
	define('CONTRASENA', '');
	define('BASE', '');
} else {
	// Reservados para DESARROLLO, cambiar por los de su LAPTOP, PC, etc.
	define('SERVIDOR', 'localhost');
	define('USUARIO', 'root');
	define('CONTRASENA', 'root');
	define('BASE', 'cordova');
}

define('RUTA_PDFS', '../pdfs/');
define('RUTA_IMAGENES', '../../imagenes/');
