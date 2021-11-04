import React from "react";
import MenuAppBar from "../../../Layout/Navbar";
import GoalsStatusTabs from "./StatusTabs";
import './goalStatus.css'
import { Link } from "react-router-dom";
import SmsIcon from "@material-ui/icons/Sms";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const GoalsStatus = () => {
 

  return (
    <div className="goalsStatus_container">
      <MenuAppBar />
      <div className="mobViewHead statusMobHead">
        <div className="mobViewHeadContent">
          <div className="mobHeadBack">
            <Link className="mobHeadBack_link" to="/selec-goals">
              <ArrowBackIosIcon />
            </Link>
          </div>
          <h2>Frequency</h2>
          <div className="headChatIcon">
            <SmsIcon />
          </div>
        </div>
      </div>
      <div className="goalsStatus_section">
        <GoalsStatusTabs />
      </div>
    </div>
  );
};

export default GoalsStatus;
