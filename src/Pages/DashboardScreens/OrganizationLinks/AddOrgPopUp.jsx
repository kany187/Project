import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from '../../../Config/FirebaseConfig';

export default function FormDialog() {
  const database = firebase.database()
  const ref = database.ref('organizations')
  const pushRef = ref.push()
  // close dialog box 
  const [open, setOpen] = React.useState(false);
  // set org input value 
  let [organization,setOrganization] = useState('')

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOrganization =(event)=>{
    setOrganization(event.target.value)
  }

  // add organization in firebase database 
  const addOrganization = ()=>{
    if(organization.length>3){

      pushRef.set({orgName : organization})
      .then(()=>{
        handleClose()
      }).catch((err)=>{
        console.log(err)
        handleClose()
      })
    }else{
      alert('please enter value or enter max 3 characters')
    }
    }



  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={organization}
            onChange={handleOrganization}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addOrganization} color="primary">
            Add Organization
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
