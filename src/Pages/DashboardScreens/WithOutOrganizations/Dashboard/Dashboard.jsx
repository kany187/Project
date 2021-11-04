import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MiniDrawer from "../../Sidebar";
import GoalsTable from "./GoalsTable";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import "./style.css";
import SearchInput from "../../../../Components/SearchInput";
import firebase from "../../../../Config/FirebaseConfig";
import { useSelector, useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {
  setWithoutOrgGoalsAtoZ,
  highToLowWithoutOrgGoals,
  filterWithEndDateWithoutOrg,
  filterWithEventNameWithoutOrg,
  selectedCategoryWithoutOrg,
} from "../../../../GlobalState/CreateSlice";

const WithoutOrganizationDashboard = () => {
  const dispatch = useDispatch();
  const db = firebase.database();
  const dbRef = db.ref(`withoutOrganization/categories`);
  let [category, setCateggory] = useState([]);

  // get  organization Category from database
  const getFilterOrgGoals = () => {
    dbRef.on("value", (snapshot) => {
      let orgCategoryArry = [];
      snapshot.forEach((data) => {
        const getData = data.val();
        const getId = data.key;
        getData.id = getId;
        orgCategoryArry.push(getData);
      });
      setCateggory(orgCategoryArry);
    });
  };

  useEffect(() => {
    getFilterOrgGoals();
    return () => {
      getFilterOrgGoals();
    };
  }, []);

  const selector = useSelector((state) => {
    return state.goalReducer;
  });

  // goals search function
  const handleChange = (e) => {
    dispatch(filterWithEventNameWithoutOrg(e.target.value));
  };

  const handleAtoZ = (e) => {
    dispatch(setWithoutOrgGoalsAtoZ(e.target.value));
  };

  const handleHighToLow = (e) => {
    dispatch(highToLowWithoutOrgGoals(e.target.value));
  };

  const handleDateFilter = (e) => {
    dispatch(filterWithEndDateWithoutOrg(e.target.value));
  };

  const handleCategory = (e) => {
    dispatch(selectedCategoryWithoutOrg(e.target.value));
  };

  return (
    <div className="dashboard_container">
      <div className="dashboard_md">
        <div className="dashboard_left_content">
          <MiniDrawer withOutOrg />
        </div>
        <div className="dashboard_right_content">
          <div className="dashboard_main_md">
            <div className="searchInputBox">
              <SearchInput category={category} handleChange={handleChange} />
            </div>
            <div className="tableAnd_tabs_container">
              <div className="table_tabs_head">
                <div className="tb_tabs_headContent">
                  <p>Goals list</p>
                </div>
                <div className="create_goals_link">
                  <Link
                    to={`/without-organization/create-goals`}
                    className="cus_btn"
                  >
                    Create goals <AddCircleOutlineIcon className="add_icon" />
                  </Link>
                </div>
              </div>
              <div className="filters_section">
                <select name="asc" id="asc" onChange={handleHighToLow}>
                  <option value="">ASC / DSC</option>
                  <option value="htl">ascending</option>
                  <option value="lth">descending</option>
                </select>
                <select
                  name="asc"
                  id="asc"
                  onChange={handleAtoZ}
                  style={{ marginLeft: "10px" }}
                >
                  <option value="">A to Z / Z toA</option>
                  <option value="atoz">A to Z</option>
                  <option value="ztoa">Z to A</option>
                </select>
                <input
                  type="text"
                  name="filter"
                  id="filter"
                  placeholder="Enter date format(yyyy-mm-dd)"
                  style={{ marginLeft: "10px" }}
                  onChange={handleDateFilter}
                />
                <div className="category_filter">
                  <Autocomplete
                    id="grouped-demo"
                    options={category.map((val) => val.category)}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="With categories"
                        variant="outlined"
                      />
                    )}
                    onSelect={handleCategory}
                  />
                </div>
              </div>

              <GoalsTable selector={selector.withoutOrgGoals} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithoutOrganizationDashboard;
