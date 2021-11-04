import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CloseIcon from '@material-ui/icons/Close';
export default function AlertDialog({
  open,
  handleClose,
  value,
  btnValue,
  balanceInput,
  handleChange,
  inputValue,
  handleAddFunc,
  closeBtn
}) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {closeBtn?
          <div className='clsBtnDiv'>
            <button className="closedBtn" onClick={handleClose}><CloseIcon /></button>
          </div>
         : null }
          {!balanceInput ? (
            <DialogContentText
              id="alert-dialog-description"
              className="centerText"
            >
              {value}
            </DialogContentText>
          ) : (
            <div className='blnceInput'>
              <input
                type="text"
                onChange={handleChange}
                value={inputValue}
                placeholder="Enter balance"
              />
            </div>
          )}
        </DialogContent>
        <div className="dialog_btn_main">
          <button className="start_goal_btn" onClick={handleAddFunc?handleAddFunc:handleClose}>
            {btnValue}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
