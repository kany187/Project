import React, { useEffect, useState } from "react";
import FormDialog from "../../../../Components/InputPopup";
import firebase from "../../../../Config/FirebaseConfig";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";

const CategoryList = () => {
  const database = firebase.database();
  const ref = database.ref(`withoutOrganization/categories`);
  const pushRef = ref.push();
  const [open, setOpen] = React.useState(false);
  let [dbCategory, setDbCategory] = useState([]);
  // set org input value
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let [category, setCategory] = useState("");
  const handleCategoryInput = (event) => {
    setCategory(event.target.value);
  };

  // add organization in firebase database
  const addCategory = () => {
    if (category.length > 3) {
      pushRef
        .set({ category: category })
        .then(() => {
          setCategory("");
          handleClose();
        })
        .catch((err) => {
          console.log(err);
          setCategory("");
          handleClose();
        });
    } else {
      alert("please enter value or enter max 3 characters");
    }
  };

  useEffect(() => {
    ref.on("value", (snapshot) => {
      let categoryArray = [];
      snapshot.forEach((data) => {
        let resData = data.val();
        let dataKey = data.key;
        resData.id = dataKey;
        categoryArray.push(resData);
      });
      setDbCategory(categoryArray);
    });
    // };
    // getCategory();
    // return ()=>{
    //   getCategory()
  }, []);

  const selector = useSelector((state) => {
    return state.goalReducer;
  });

  const handleDeleteCategory = (event) => {
    let { category } = event;
    const categoryId = event.id;
    let filterUsedCategory = selector.OrgGoals.filter(
      (val) => val.inputValues.category === category
    );
    if (!filterUsedCategory.length) {
      database
        .ref(`withoutOrganization/categories/${categoryId}`)
        .remove()
        .then(() => {
          console.log("deleted");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("this cateogry is used in goals");
    }
  };

  return (
    <div className="c_list_container">
      <div className="cList_md">
        <div className="cList_sd">
          <div className="categoryList">
            <div className="category_head">
              <div className="tb_tabs_headContent">
                <p>Category list</p>
              </div>
              <div className="addCt_btn">
                <Button onClick={handleClickOpen} className="orngClr ">
                  Add Category
                </Button>
                <FormDialog
                  handleAddFunction={addCategory}
                  handleInputvalue={handleCategoryInput}
                  inputValue={category}
                  open={open}
                  // handleClickOpen={handleClickOpen}
                  handleClose={handleClose}
                  btnValue="Add Category"
                  labelValue="Category"
                />
              </div>
            </div>
            <ul className="cList">
              {dbCategory &&
                dbCategory.map((val) => (
                  <li key={val.id}>
                    <p> {val.category}</p>
                    <button
                      className="btn_dlt"
                      onClick={() => handleDeleteCategory(val)}
                    >
                      <DeleteForeverIcon />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
