<?php
final class Salir
{

  public function __construct()
  {
    session_start();
  }
  public function terminarSesion()
  {
    $_SESSION["idUsuario"] = null;
    $_SESSION["ipUsuario"] = null;
    $_SESSION["tokenUsuario"] = null;
    $_SESSION["rolUsuario"] = null;

    unset($_SESSION["idUsuario"]);
    unset($_SESSION["ipUsuario"]);
    unset($_SESSION["tokenUsuario"]);
    unset($_SESSION["rolUsuario"]);

    session_unset();
    session_destroy();
    return sha1(md5(microtime()));
  }
  public function __toString()
  {
    return '¿Que esperabas ver?';
  }
  public function __clone()
  {
    throw new Exception("HOY , solo hay clones de Homero Simpson");
  }
  public function __destruct()
  {
    //vacio por el momento
  }
}
