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

  const handleLimpiar = () => {
    setFile(null);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const extension = file.name.split(".")[1];
    console.log(extension);
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

    readXlsxFile(file).then((data) => {
      setData(data);
      validaciones(data);
    });
  };

  const validaciones = (datos) => {
    if (!validaColumnas(datos[0])) {
      return;
    }
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

    /* patron[0].forEach((p) => {
      const aux2 = ent.find((e) => p === e);
      if (!aux2) {
        aux1 = false;
      }
    }); */
  };

  /* Valida es que existen campos requeridos
  dentro de la estructura. */
  const validaCampos = (ent) => {
    let aux1 = true;
    patron[0].forEach((p) => {
      const aux2 = ent.find((e) => p === e);
      if (!aux2) {
        aux1 = false;
      }
    });
    return aux1;
  };

  /*
  Valida tipo de dato en cada columna.
  Depende de la función ValidaCampos.
  
  Nombre   Apellido  Edad  rut      fecha
  string   string    int   string   object
  */
  const validaTipoDato = (dat) => {
    let aux1 = true;
    let aux2 = dat.slice(1);
    aux2.forEach((arr) => {
      arr.forEach((e, j) => {
        if (typeof e !== patron[1][j]) {
          aux2 = false;
          return;
        }
      });
    });
    return aux1;
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
            width: "100%",
            typography: "body1",
            marginLeft: 20,
            marginRight: 20,
            marginTop: 5,
          }}
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Correctos" value="1" />
                <Tab label="Errores" sx={{ color: "red" }} value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">Item One</TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
          </TabContext>
        </Box>
      )}
      <Modal openModal={modalOpen} />
    </>
  );
};
