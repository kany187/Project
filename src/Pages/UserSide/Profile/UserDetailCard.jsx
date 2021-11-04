import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TextsmsOutlinedIcon from "@material-ui/icons/TextsmsOutlined";
import firebase from "../../../Config/FirebaseConfig";
import AddAPhotoOutlinedIcon from "@material-ui/icons/AddAPhotoOutlined";
import dp from "../../../Assets/dp.png";
import { userlogOut, setCurrentUser } from "../../../GlobalState/CreateSlice";
import {
  setAllSelectedGoals,
  setCurrentUserOrganizationId,
  setAllGoals,
} from "../../../GlobalState/UserSideSlice";
import { useDispatch, useSelector } from "react-redux";
import AlertDialog from "../../../Components/AlertPopup";

const UserDetailCard = ({ userDetail }) => {
  const selector = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = firebase.auth();
  const db = firebase.database();
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgurl] = useState("");
  const [imgName, setImgName] = useState("");
  const [local, setLocal] = useState("");

  //  upload img function
  const handleGoalImg = (event) => {
    const url = URL.createObjectURL(event.target.files[0]);
    const goalImgName = event.target.files[0].name;
    setImgurl(url);
    setImgName(goalImgName);
    setLocal(event.target.files[0]);
  };
  const handleCancel = () => {
    setImgurl("");
    setImgName("");
    setLocal("");
  };
  // firebase storage ref
  const storage = firebase.storage();
  const userDb = firebase.database();
  let createStorageRef = () => storage.ref(`dpImages/${imgName}`).put(local);
  let downLoad = () => storage.ref(`dpImages/${imgName}`).getDownloadURL();
  const handleUploadProfileImg = () => {
    setLoading(true);
    // set image in storage
    createStorageRef().then(() => {
      // download img from storage
      downLoad().then((url) => {
        userDb
          .ref(`users/${userDetail.id}/${userDetail.pushId}`)
          .update({ url })
          .then(() => {
            setLoading(false);
            setImgurl("");
            setImgName("");
            setLocal("");
          })
          .catch(() => {
            setLoading(false);
            setImgurl("");
            setImgName("");
            setLocal("");
          });
      });
    });
  };
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(userlogOut(false));
        dispatch(setCurrentUser({}));
        dispatch(setAllGoals([]));
        dispatch(setAllSelectedGoals([]));
        dispatch(setCurrentUserOrganizationId(""));
        history.push("/login");
      })
      .catch((err) => {});
  };

  // add user balance working
  let [showpopUp, setshowpopUp] = useState(false);
  let [userId, setUserId] = useState("");
  let [userBalance, setUserBalance] = useState();
  let [alertPopup, setAlertPopup] = useState(false);
  const handleShowInput = () => {
    setUserId(selector.userReducer.currentUserOfOrganization[0].orgMainId);
    setUserBalance(selector.userReducer.currentUserOfOrganization[0].balance);
    setshowpopUp(true);
  };

  let [inpbBalance, setInpBalance] = useState("");
  const handleBalance = (event) => {
    setInpBalance(event.target.value);
    console.log(userId, userBalance);
  };

  // add user balance function
  const handleAddUserBalance = () => {
    if (Number(inpbBalance) >= 0) {
      if (userDetail.orgId != "") {
        db.ref(`organizations/${userDetail.orgId}/users/${userId}`)
          .update({
            balance:
              // Number(inpbBalance)?
              userBalance + Number(inpbBalance),
            // : userBalance + 0
          })
          .then(() => {
            setshowpopUp(false);
            setInpBalance("");
            // console.log('added')
          })
          .catch(() => {
            setshowpopUp(false);
            // console.log('cancel')
            setInpBalance("");
          });
      } else {
        db.ref(`withoutOrganization/users/${userId}`)
          .update({
            balance:
              // Number(inpbBalance)?
              userBalance + Number(inpbBalance),
            // : userBalance + 0
          })
          .then(() => {
            setshowpopUp(false);
            setInpBalance("");
          })
          .catch(() => {
            setshowpopUp(false);
            setInpBalance("");
          });
      }
    } else {
      setshowpopUp(false);
      setAlertPopup(true);
    }
  };

  const handleClose = () => {
    setInpBalance("");
    setshowpopUp(false);
  };
  const handleCloseTwo = () => {
    setAlertPopup(false);
    setInpBalance("");

  };

  if (!userDetail) {
    return <div>Loading</div>;
  }

  return (
    <div className="userDetail_contaier">
      {showpopUp ? (
        <AlertDialog
          handleClose={handleClose}
          open={showpopUp}
          handleAddFunc={handleAddUserBalance}
          value="Reported Successfull"
          btnValue="Add"
          balanceInput
          handleChange={handleBalance}
          inputValue={inpbBalance}
          closeBtn
        />
      ) : null}
      {alertPopup ? (
        <AlertDialog
          handleClose={handleCloseTwo}
          open={alertPopup}
          // handleAddFunc={handleClose}
          value="Please Enter greater than 0 amount"
          btnValue="Ok"
        />
      ) : null}
      <div className="mobViewHead">
        <div className="mobViewHeadMain mobVwHead">
          <div className="mobViewHeadContent">
            <div className="mobHeadBack">
              <Link className="mobHeadBack_link" to="/selec-goals">
                <ArrowBackIosIcon />
              </Link>
            </div>
            <h2>Profile</h2>
            <div className="headChatIcon">
              <TextsmsOutlinedIcon />
            </div>
            {/* mob view user info  */}
            <div className="userInfoLeft mobView">
              {/* <img src={userDetail.url} alt="..." /> */}
              <div className="userDpAdd">
                <img src={userDetail.url ? userDetail.url : dp} alt="..." />
                <label htmlFor="goalImg" className="dpImg">
                  <input
                    type="file"
                    name="goalImg"
                    // required
                    onChange={handleGoalImg}
                    style={{ display: "none" }}
                    id="goalImg"
                  />
                  <AddAPhotoOutlinedIcon className="cmIcon" />
                </label>
              </div>
              {imgUrl ? (
                <>
                  <img className="dp_upload_img" src={imgUrl} alt="..." />
                  <div className="uBtns">
                    <button
                      disabled={loading}
                      onClick={() => handleUploadProfileImg()}
                    >
                      {!loading ? "Upload" : "loading..."}
                    </button>
                    <button disabled={loading} onClick={() => handleCancel()}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : null}
              <p className="uName"> {userDetail.name}</p>
              <p className="uEmail"> {userDetail.email}</p>
              <p className="uEmail">Organization : {userDetail.orgName}</p>
              <p className="uEmail">
                Balance :{" "}
                {selector.userReducer.currentUserOfOrganization.length
                  ? selector.userReducer.currentUserOfOrganization[0].balance
                  : 0}
              </p>
            </div>
            {/* end  */}
          </div>
        </div>
      </div>
      <div className="userDetail_md">
        <div className="userDetial_content">
          {/* buttons for mob view  */}
          <div className="mobViewUserBtns">
            <MenuIcon className="uMenuIcon" />
            <div className="uBtns">
              <button>Premium</button>
              <button>Free</button>
            </div>
          </div>
          {/* end  */}
          <div className="userDetail_box">
            {/* desktop view user info  */}
            <div className="userInfoLeft desktopView">
              <Link to="/selec-goals" className="Verifyback_link dpLinkB">
                <ArrowBackIcon className="orngBack" />
              </Link>
              <div className="userDpAdd">
                <img src={userDetail.url ? userDetail.url : dp} alt="..." />
                <label htmlFor="goalImg" className="dpImg">
                  <input
                    type="file"
                    name="goalImg"
                    // required
                    onChange={handleGoalImg}
                    style={{ display: "none" }}
                    id="goalImg"
                  />
                  <AddAPhotoOutlinedIcon className="cmIcon" />
                </label>
              </div>
              {imgUrl ? (
                <>
                  <img className="dp_upload_img" src={imgUrl} alt="..." />
                  <div className="uBtns">
                    <button
                      disabled={loading}
                      onClick={() => handleUploadProfileImg()}
                    >
                      {!loading ? "Upload" : "loading..."}
                    </button>
                    <button disabled={loading} onClick={() => handleCancel()}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : null}
              <p className="uName"> {userDetail.name}</p>
              <p className="uEmail"> {userDetail.email}</p>
              <p className="uEmail">Organization : {userDetail.orgName}</p>

              <div className="uBtns">
                <button>Premium</button>
                <button>Free</button>
              </div>
            </div>
            {/* end  */}
            <div className="userLinksRight">
              <div className="balnceBtn">
                <button onClick={() => handleShowInput()}>Add Balance</button>
              </div>
              <ul className="uLinks">
                <li>
                  <p className="mLink">Investing & Goals</p>
                  <p className="subLinksName">- Balances,List,Stats</p>
                </li>
                <li>
                  <p className="mLink">Transfers</p>
                  <p className="subLinksName">- Deposits,Withdrawls</p>
                </li>
                <li>
                  <p className="mLink">Statements & History</p>
                  <p className="subLinksName">- Docs,Tax,Activity</p>
                </li>
                <li>
                  <p className="mLink">Sections </p>
                  <p className="subLinksName">
                    - Notifications,Disclosure(Tes)
                  </p>
                </li>
                <li>
                  <p className="mLink">Help</p>
                  <p className="subLinksName">- Balances,List,Stats</p>
                </li>
                <li className="forMob" onClick={() => handleLogout()}>
                  LogOut
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailCard;
