<?php
require_once 'base.php';
require_once 'peticiones.php';

final class  Paises extends Base implements peticiones
{
    private $_sql;

    private  $_idPais;

    private  $_nombre;

    private $_iso2;

    private $_tipo;

    private $_reportePDF;

    private $_resultSet;

    private $_registro;

    private $_criterio;

    private $_columna;

    private $_columnas;

    private $_aliasColumnas;

    public function __construct()
    {
        if (parent::validaSesion()){
            parent::__construct();

            $this->_columnas = array('', 'paises.id_pais', 'paises.nombre', 'paises.iso2');
            $this->_aliasColumnas = 'paises.id_pais AS a, paises.nombre AS b, paises.iso2 AS c';
        }else{
            throw new Exception("No tienes permisos.");
            return;
        }
    }
    public function listar($tipo)
    {
        $this->_tipo = intval($tipo);
        $this->_sql = sprintf("SELECT %s FROM paises WHERE paises.id_pais > 0 ORDER BY paises.id_pais ASC;",
        $this->_aliasColumnas);

        return $this->sentenciaSQL($this->_sql, $this->_tipo);
    }
    public function buscar($criterio, $columna, $tipo)
    {
        $this->_tipo = intval($tipo);
        $columna = intval($columna);
        if ($columna == 0)
        {
            $this->_idPais = $this->formatear($criterio, "CadenaBusqueda");
            $this->_nombre = $this->formatear($criterio, "CadenaBusqueda");
            $this->_iso2 = $this->formatear($criterio, "CadenaBusqueda");
            $this->_sql = sprintf("SELECT %s FROM paises WHERE (paises.id_pais LIKE %s OR paises.nombre LIKE %s OR paises.iso2 LIKE %s) ORDER BY paises.id_pais ASC;",
            $this->_aliasColumnas,$this->_idPais, $this->_nombre, $this->_iso2);
        }else{
            $this->_columna = $this->_columnas[$columna];
            $this->_criterio = $this->formatear($criterio, "CadenaBusqueda");
            $this->_sql = sprintf("SELECT %s FROM paises
            WHERE %s LIKE %s ORDER BY paises.id_pais ASC;",
            $this->_aliasColumnas,$this->_columna,$this->_criterio);
        }
        return $this->sentenciaSQL($this->_sql, $this->_tipo);
    }
    public function insertar($registro)
    {
       if (is_array($registro))
       {
           $registro = (object)$registro;
       }
       $this->_nombre = $this->formatear($registro->b, "Cadena");
       $this->_iso2 = $this->formatear($registro->c, "Cadena");
       $this->_sql = sprintf("INSERT INTO PAISES VALUES (NULL, %s, %s);",
       $this->_nombre, $this->_iso2);

       return $this->sentenciaSQL($this->_sql, 4);
    }
    public function actualizar($registro)
    {
        if (is_array($registro))
        {
            $registro = (object)$registro;
        }
        $this->_idPais = $this->formatear($registro->a, "Entero");
        $this->_nombre = $this->formatear($registro->a, "Cadena");
        $this->_iso2 = $this->formatear($registro->a, "Cadena");
        $this->_sql = sprintf("UPDATE paises
        SET paises.nombre=%s, paises.iso=%s WHERE paises.id_pais = %s LIMIT 1;",
        $this->_nombre,$this->_iso2, $this->_idPais);

        return $this->sentenciaSQL($this->_sql, 5);
    }
    public function borrar($registro)
    {
        if (is_array($registro))
        {
            $registro = (object)$registro;
        }
        $this->_idPais = $this->formatear($registro->a, "Entero");
        $this->_sql = sprintf("DELETE FROM paises
        WHERE paises.id_pais=%s LIMIT 1;", $this->_idPais);

        return $this->sentenciaSQL($this->_sql,5);
    }

    public function reportePDF($tipo, $criterio='', $columna='')
    {
        switch (strval($tipo)) {
            case 'listar':
                $this->_resulSet = $this->listar(0);
                $_nombre = 'listar_paises.pdf';
                $_titulo = 'Listados de Paises';
            break;
            case 'buscar':
                $this->_resulSet = $this->buscar($criterio, $columna, 0);
                $this->_nombre = 'busqueda_paises.pdf';
                $this->_titulo = 'Buscqueda de Paises por "'. $criterio . '"';
            break;
            default :
                throw new Exception('NO hay tipo de reporte definido');
                return;
        }
        require_once 'fabricapdf.php';

        $this->_reportePDF = new FabricaPDF('P', 'mm', 'CARTA', true, 'UTF-8',false);
        $this->_reportePDF->colocarCaracteristicas($this->_reportePDF, $_titulo, 'Alejandro Ceron');
        $this->_reportePDF->colocarMargenes($this->_reportePDF, 30, 10 , 5, 5 , 10, 10, true);
        $this->_reportePDF->AddPAge();
        $this->_reportePDF->SetFont('times', 'B', 9);
        $this->_reportePDF->Cell(20, 0, 'ID', 0, 0, 'R', 0);
        $this->_reportePDF->Cell(1);
        $this->_reportePDF->Cell(158, 0, 'Nombre', 0, 0, 'L', 0);
        $this->_reportePDF->Cell(1);
        $this->_reportePDF->Cell(26, 0, 'ISO', 0, 1 , 'L', 0);
        $this->_reportePDF->Ln(1);
        $this->_reportePDF->SetFont('times', '', 9);
        $this->_reportePDF->SetFillColor(217, 248, 207);
        $i =0;
        while ($this->_registro = $this->_resultSet->fetch_assoc()) {
            $rellenar = ((++$i) %2);
            $this->_reportePDF->Cell(20, 0, $this->_registro['a'],0 ,0, 'R', $rellenar, null, 1);
            $this->_reportePDF->Cell(1);
            $this->_reportePDF->Cell(158, 0, $this->_registro['b'],0 ,0, 'L', $rellenar, null, 1);
            $this->_reportePDF->Cell(1);
            $this->_reportePDF->Cell(20, 0, $this->_registro['c'],0 ,1, 'L', $rellenar, null, 1);
        }
        $this->_reportePDF->Ln(5);
        $this->_reportePDF->SetFont('times', 'B', 9);
        $this->_reportePDF->Cell(0, 0, 'Este Reporte contiene ', $this->_resultSet->num_rows . ' Pais(es).', 0, 1, 'L', 0);
        $this->_reportePDF->Output('../pdfs/'. $_nombre, 'F');
        return $_nombre;
    }
}
