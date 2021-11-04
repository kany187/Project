import React from "react";
import TextField from "@material-ui/core/TextField";

export default function SearchInput({  handleChange}) {

  return (

    <TextField
    id="outlined-textarea"
    label="Search Goals"
    multiline
    variant="outlined"
    onChange={handleChange}
  />
  );
}


