import React, { useState } from "react";
import { Link } from "react-router-dom";
import MiniDrawer from "../Sidebar";
// import AddOrganization from "./AddOrgPopUp";
import { useSelector } from "react-redux";
import firebase from "../../../Config/FirebaseConfig";
import InputPopup from "../../../Components/InputPopup";
import { Button } from "@material-ui/core";

// import "./Org.css";

const MainOrganization = () => {
  const database = firebase.database();
  const ref = database.ref("organizations");
  const pushRef = ref.push();
  // close dialog box
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // set org input value
  let [organization, setOrganization] = useState("");

  const handleOrganization = (event) => {
    setOrganization(event.target.value);
  };
  // add organization in firebase database
  const addOrganization = () => {
    if (organization.length > 3) {
      pushRef
        .set({ orgName: organization })
        .then(() => {
          handleClose();
          setOrganization('')
        })
        .catch((err) => {
          console.log(err);
          setOrganization('')
          handleClose();
        });
    } else {
      alert("please enter value or enter max 3 characters");
    }
  };

  const organizations = useSelector((state) => {
    return state.goalReducer.organizations;
  });

  return (
    <div className="mainOrg_contianer">
      <div className="mainOrg_md">
        <div className="mainOrg_sd">
          <div className="dashboard_left_content">
            <MiniDrawer linksShow />
          </div>
          <div className="org_main_right">
            <div className="org_body">
              <div className="org_links">
                {organizations.map((val) => (
                  <Link
                    className="org_btn_links"
                    to={`/organizations/${val.id}/dashboard`}
                    key={val.id}
                  >
                    {val.orgName}
                  </Link>
                ))}
                <div className="withoutOrg">
                <Link
                    className="org_btn_links"
                    to={`/without-organization/dashboard`}
                    // key={val.id}
                  >
                    {/* {val.orgName} */}
                    Without Organization
                  </Link>
                </div>
              </div>
              <div className="new_org">
                <Button onClick={handleClickOpen} className='orngClr '>
                Add Organization
                </Button>
                <InputPopup
                  handleAddFunction={addOrganization}
                  handleInputvalue={handleOrganization}
                  inputValue={organization}
                  // handleClickOpen={handleClickOpen}
                  open={open}
                  handleClose={handleClose}
                  labelValue='Organization name'
                  btnValue='Add Organization'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainOrganization;
