import React from "react";
import MiniDrawer from "../../Sidebar";
import CategoryList from "./CategoryList";
import "./style.css";

const WithoutOrgCategories = () => {
  return (
    <div>
      <div className="dashboard_md">
        <div className="dashboard_left_content">
          <MiniDrawer withOutOrg />
        </div>
        <div className="dashboard_right_content">
          <div className="dashboard_main_md">
            <div className="top_route_head">
            </div>
            <div className="tableAnd_tabs_container">
             
              <CategoryList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithoutOrgCategories;
