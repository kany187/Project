import React from "react";
import UserList from "./UserList";
import HomeIcon from "@material-ui/icons/Home";
import MiniDrawer from "../../Sidebar";
import "./style.css";

const OrganizationUsers = () => {
  return (
    <div>
      <div className="dashboard_md">
        <div className="dashboard_left_content">
          <MiniDrawer />
        </div>
        <div className="dashboard_right_content">
          <div className="dashboard_main_md">
            <div className="top_route_head">
              <p className="top_route_icon">
                <HomeIcon />
              </p>
              <p style={{ marginLeft: "10px" }}>Users</p>
            </div>
            <div className="tableAnd_tabs_container">
              <div className="table_tabs_head">
                <div className="tb_tabs_headContent">
                  <p>Users list</p>
                </div>

              </div>
              <UserList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationUsers;
