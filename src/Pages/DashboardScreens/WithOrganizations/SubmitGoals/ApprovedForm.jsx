import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

export default function ApprovedForm({
  handleAddFunction,
  handleInputvalue,
  inputValue,
  open,
  handleClose,
  btnValue,
  labelValue,
  imgUrl,
  loading,
  handleSelect,
  range,
  rewardInp,
  number
}) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {imgUrl ? (
          <img src={imgUrl} alt="..." />
        ) : (
          <DialogContent>
            {!rewardInp?
            <>
            <div className="percentageSelect">
              <p>Percentage</p>
              <select name="per" id="per" onChange={handleSelect}>
                <option value="">select percentage</option>
                <option value="100">100%</option>
                <option value="90">90%</option>
                <option value="80">80%</option>
                <option value="70">70%</option>
                <option value="60">60%</option>
                <option value="50">50%</option>
              </select>
            </div>
            <div className="rewardRange">
              <p>Range of Reward {range}</p>
            </div>
            </>
            : null
}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={labelValue}
              type={!number? "text" : 'number'}
              fullWidth
              value={inputValue}
              onChange={handleInputvalue}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button
            disabled={loading}
            onClick={imgUrl? handleClose :handleAddFunction }
            color="primary"
          >
            {loading ? "Loading..." : btnValue}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
