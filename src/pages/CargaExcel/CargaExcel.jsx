import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FileInput from "@mui/material/Input";
import { useState } from "react";
import readXlsxFile from "read-excel-file";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Modal from "../../components/Modal";

export const CargaExcel = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [value, setValue] = useState("1");
  const [modalOpen, setModalOpen] = useState({
    isInfo: true,
    open: false,
    title: "",
    msj: "",
  });
  const patron = [
    ["Nombre", "Apellido", "Edad", "Rut", "Fecha Nacimiento"],
    ["string", "string", "number", "string", "object"],
  ];

  const [tableOK, setTableOk] = useState([]);
  const [tableError, setTableError] = useState([]);

  const handleLimpiar = () => {
    setFile(null);
  };
  const handleGrabarDatos = () => {
    setModalOpen({
      isInfo: false,
      open: true,
      title: "Grabar datos",
      msj: "¿Confirma que desea grabar los datos que se muestran en la tabla?",
    });
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const extension = file.name.split(".")[1];
    if (extension !== "xlsx") {
      setFile(null);
      setModalOpen({
        isInfo: true,
        open: true,
        title: "Archivo inválido",
        msj: "El archivo debe tener extensión .xlsx",
      });
      return;
    }

    setFile(file);

    /**Se obtiene archivo Excel --------------------------------*/
    readXlsxFile(file).then((data) => {
      setData(data);
      if (!validaColumnas(data[0])) {
        return;
      }
      // Construcción de dos tablas, Datos Correctos y Errores, para ser desplegadas.
      tablesBuild(data);
    });
  };
  /** Fin se obtiene archivo Excel--------------------------------- */

  const tablesBuild = (dataXlsx) => {
    // Obtención de arreglo de Índices Cabecera ordenados según patrón.
    const indexColArray = [];
    const headersIn = dataXlsx[0];
    const headersPatron = patron[0];
    headersPatron.forEach((name) => {
      indexColArray.push(headersIn.indexOf(name));
    });

    const dataNoHeaders = dataXlsx.slice(1);
    const dataOk = [];
    const dataNoOk = [];

    // Comprobación existencia de dato y tipo de dato coincidente. -----------
    dataNoHeaders.forEach((d) => {
      // Reordenamiento de la fila
      const orderedRow = [];
      indexColArray.forEach((i) => {
        orderedRow.push(d[i]);
      });

      // Comprobación de existencia de dato y tipo de dato.
      const dataTypes = patron[1];
      let flagOk = true;
      const auxRow = [];

      orderedRow.forEach((cell, j) => {
        const auxObject = {
          value: cell,
          error: false,
          mensaje: "",
        };
        if (cell !== undefined && cell !== "" && cell !== null) {
          if (typeof cell !== dataTypes[j]) {
            auxObject.mensaje = `En ${headersPatron[j]}, tipo de dato no coindide.`;
            auxObject.error = true;
            flagOk = false;
          }
        } else {
          auxObject.mensaje = `${headersPatron[j]} faltante`;
          auxObject.error = true;
          flagOk = false;
        }
        auxRow.push(auxObject);
      });

      if (flagOk) {
        dataOk.push(auxRow);
      } else {
        dataNoOk.push(auxRow);
      }
    });
    // Llenado de tablas CORRECTO y ERROR
    if (dataOk.length > 0) {
      setTableOk(dataOk);
    }
    if (dataNoOk.length > 0) {
      setTableError(dataNoOk);
    }

    console.log("dataOk: ", dataOk);
    console.log("dataNoOk: ", dataNoOk);

    /**
     *  TODO: declarar un objeto que contendrá los Index de los campos patron, en ese orden. (Listo)
     *  TODO: obtener los índices de las columnas según el patrón. (Listo)
     *  TODO: declarar una variable auxiliar tipo array para almacenar la fila. (Listo)
     *  TODO: declarar una variable auxiliar tipo array para almacenar mensajes de error. (Listo) No necesario
     *  TODO: declarar un objeto con las propiedades: (Listo)
     *        auxObject = {
                   originIndex: ,
     *             value: ,
     *             error: ,
     *             mensaje: ,
     *          }
     *  TODO: declarar una variable que contenga los registros sin la cabecera de titulos de columnas (Listo)        
        TODO: Tomar una fila de datos original y comprobar: 
              - si el dato existe (no vacío).
              - el tipo de dato de cada celda con el del patron, usando el orden de los índices.
        TODO: Almacenar datos en el objeto según los validaciones anteriores:
        Ejemplo 1:
     *          dato = {
                   originIndex: 1,
     *             value: 'Nombre',
     *             error: false,
     *             mensaje: '',
     *          }
     * Ejemplo 2:
     *          dato = {
                   originIndex: 1,
     *             value: 'Fecha de Inicio',
     *             error: true,
     *             mensaje: 'Dato faltante', //Puede ser "Tipo de dato no coincide" o "Dato faltante"
     *          }   
     *       Al finalizar el recorrido de la fila, si la variable "errores" tiene mensajes, entonces
     *       se crea un último registro para colocar los mensajes y el registro irá a la variable 
     *       array de ERRORES, si no, el registro ira a la variable array de CORRECTOS.
     */
  };

  // Valida que número de columnas de archivo de entrada es mayor o igual que el número de columnas patrón.
  const validaColumnas = (columns) => {
    if (columns.length < patron[0].length) {
      setFile(null);
      setModalOpen({
        isInfo: true,
        open: true,
        title: "Validación de número de Columnas",
        msj: "El archivo no cumple con la estructura válida. El número de Columnas ingresado es menor al número obligatorio.",
      });
      return false;
    }
    let aux = true;
    patron[0].forEach((p) => {
      if (!columns.includes(p)) {
        aux = false;
        setModalOpen({
          isInfo: true,
          open: true,
          title: "Validación de número de Columnas",
          msj: "El archivo no cumple con la estructura válida. Una o más columnas requeridas faltante.",
        });
        return;
      }
    });
    return aux;
  };

  return (
    <>
      <Box sx={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
        <hr />
        <Typography variant="h4" sx={{ marginTop: 5 }}>
          Demo Carga y previsualización de archivo Excel
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 5,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <Button variant="contained" color="primary" component="label">
          Cargar archivo
          <FileInput
            type="file"
            accept=".xlsx .csv"
            sx={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Button>
        <Button
          variant="outlined"
          sx={{ marginLeft: 2 }}
          onClick={handleLimpiar}
          component="label"
        >
          Limpiar
        </Button>
      </Box>
      {file && (
        <Box sx={{ paddingLeft: 20, paddingRight: 20, marginTop: 5 }}>
          <Typography variant="body1">Nombre archivo: {file.name}</Typography>
          <Typography variant="body1">Registros: {data.length - 1}</Typography>
        </Box>
      )}

      {file && data && data.length > 0 && (
        <Box
          sx={{
            width: "80%",
            typography: "body1",
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 5,
          }}
        >
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Correctos" value="1" />
                <Tab label="Errores" sx={{ color: "red" }} value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {tableOK.length > 0 && (
                <table
                  style={{
                    border: "solid",
                    borderCollapse: "collapse",
                    width: "100%",
                  }}
                >
                  <thead style={{ backgroundColor: "" }}>
                    <tr>
                      {patron[0].map((r, i) => (
                        <th
                          style={{
                            border: "solid",
                            borderCollapse: "collapse",
                          }}
                          key={"head_" + i}
                        >
                          {r}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableOK.map((row, i) => (
                      <tr key={"row_" + i}>
                        {row.map((cell, j) => (
                          <td
                            style={{
                              border: "solid",
                              borderCollapse: "collapse",
                              textAlign:
                                patron[0][j] === "Edad" ||
                                patron[0][j] === "Rut" ||
                                patron[0][j] === "Fecha Nacimiento"
                                  ? "center"
                                  : "",
                            }}
                            key={"cell_" + j}
                          >
                            {typeof cell.value === "object"
                              ? new Date(cell.value)
                                  .toISOString()
                                  .split("T")[0]
                                  .split("-")[2] +
                                "-" +
                                new Date(cell.value)
                                  .toISOString()
                                  .split("T")[0]
                                  .split("-")[1] +
                                "-" +
                                new Date(cell.value)
                                  .toISOString()
                                  .split("T")[0]
                                  .split("-")[0]
                              : cell.value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <Box
                sx={{ display: "flex", justifyContent: "end", marginTop: 3 }}
              >
                <Button
                  variant="contained"
                  onClick={handleGrabarDatos}
                  component="label"
                >
                  Grabar datos
                </Button>
              </Box>
            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
          </TabContext>
        </Box>
      )}
      <Modal openModal={modalOpen} />
    </>
  );
};
