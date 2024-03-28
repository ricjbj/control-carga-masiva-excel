import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

const Modal = ({ openModal }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [msj, setMsj] = useState("");
  const [typeInfo, setTypeInfo] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (openModal && openModal.open) {
      handleOpen();
      setTitle(openModal.title);
      setMsj(openModal.msj);
      setTypeInfo(openModal.isInfo);
    }
  }, [openModal]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{msj}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ display: typeInfo ? "none" : "block" }}
            variant="outlined"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            sx={{
              backgroundColor: "#e10e17",
              display: typeInfo ? "none" : "block",
            }}
            variant="contained"
            onClick={() => {
              // Función para grabar la información
              handleClose();
            }}
          >
            Grabar
          </Button>
          <Button
            sx={{ backgroundColor: "#e10e17" }}
            variant="contained"
            onClick={() => {
              // Función para grabar la información
              handleClose();
            }}
            style={{ display: typeInfo ? "block" : "none" }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Modal;
