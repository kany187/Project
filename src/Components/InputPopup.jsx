import React  from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

export default function FormDialog({
  handleAddFunction,
  handleInputvalue,
  inputValue,
  open,
  // handleClickOpen,
  handleClose,
  btnValue,
  labelValue,
  fileInput,
  imgUrl,
  loading
}) {


  return (
    <div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {imgUrl ? <img src={imgUrl}  alt="..." /> : null}
        <DialogContent>
          {!fileInput ? (
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={labelValue}
              type="email"
              fullWidth
              value={inputValue}
              onChange={handleInputvalue}
            />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={labelValue}
              type="file"
              required
              fullWidth
              value={inputValue}
              onChange={handleInputvalue}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleAddFunction} className='orngClr'>
            {loading? 'Loading...': btnValue}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
