<?php
require_once 'base.php';

final Class Acceso extends Base
{
  private $_sql;
  private $_usuario;
  private $_contrasena;
  private $_id;
  private $_registro;
  private $_arrayCaracteres;
  private $_carateres;

  public function traerValidacion()
  {
    $this->_arrayCaracteres = array("b", "c", "d","f", "g", "h","j","k","m","n","p","q","r","s","t","v","w","x","y","z");
    shuffle($this->_arrayCaracteres);
    $this->_carateres = '';
    for ($indice=0; $indice < 4; $indice++) {
      $this->_carateres .= $this->_arrayCaracteres[ rand(0, count($this->_arrayCaracteres) -1) ];
    }
    $_SESSION['validacion'] = $this->_carateres;
    return $_SESSION['validacion'];
  }
  public function verificarAcceso($usuario, $contrasena, $validacion)
  {
    if(isset($_SESSION["idUsuario"])){
      throw new Exception("El Usuario ya tiene una Sesion abierta");
      return;
    }
    if ($_SESSION['validacion'] != trim($validacion)) {
      throw new Exception("La Validacion, es Incorrecta.<br /> Se Ha generado una nueva");
    }
    $this->_id = 0;
    $this->_usuario = $this->formatear($usuario,"Encriptalo");
    $this->_contrasena = $this->formatear($contrasena,"Encriptalo");
    $this->_sql = sprintf("SELECT id_usuario, rol  FROM usuarios  WHERE (usuario=%s AND contrasena=%s) AND estatus=1 LIMIT 1;",
      $this->_usuario, $this->_contrasena);
      $this->_registro = $this->sentenciaSQL($this->_sql, 7);
      $this->_id = $this->_registro['id_usuario'];
      if ($this->_id > 0) {
        $_SESSION['idUsuario']=$this->_id;
        $_SESSION['rolUsuario']= $this->_registro['rol'];
        $_SESSION['ipUsuario']= $_SERVER['REMOTE_ADDR'];
        $_SESSION['tokenUsuario'] = md5(sha1(session_id(). $_SERVER['REMOTE_ADDR'] . $_SESSION["idUsuario"]));
        $_SESSION['validacion'] = null;
        unset($_SESSION['validacion']);
        return sha1(md5(microtime()));
      }else {
        if(PRODUCCION){
          throw new Exception("Error en su permisos del Servidor");
        }else {
          throw new Exception("Error en sus permisos del Servidor: <br />" . $this->_sql);
        }
        return;
      }
    }
  }
