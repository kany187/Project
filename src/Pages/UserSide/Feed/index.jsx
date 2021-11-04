import React, { useEffect } from "react";
import MenuAppBar from "../../../Layout/Navbar";
import firebase from "../../../Config/FirebaseConfig";
// import SmsIcon from "@material-ui/icons/Sms";
import "./feed.css";
import { useSelector, useDispatch } from "react-redux";
import UsersGoals from "./UsersGoals";
import { getFeedGoals, setPostsLike ,setPostComments} from "../../../GlobalState/UserSideSlice";
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined';
// import LoadingState from "../../../Components/Loading";


const Feed = () => {
  const db = firebase.database();
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => {
    return state.goalReducer.currentUser;
  });
  const submitGoal = useSelector((state) => {
    return state.userReducer;
  });

  const getAllUsersGoals = (parameter) => {
    db.ref(parameter).on("value", (snapshot) => {
      var goalsArray = [];
      snapshot.forEach((goals) => {
        let getGoals = goals.val();
        let getGoalsId = goals.key;
        getGoals.orgMainId = getGoalsId;
        // console.log(getGoals)
        if (getGoals.submit && !getGoals.acceptReport ) {
          goalsArray.push(getGoals);
        // console.log('in condition',getGoals)

        }
      });
      dispatch(getFeedGoals(goalsArray));
    });
  };
  // get post likes data
  const getGoalsLikes = (parameter) => {
    db.ref(parameter).on("value", (snapshot) => {
      var likesArray = [];
      snapshot.forEach((goals) => {
        goals.forEach((like) => {
          let getLikes = like.val();
          let getLikesId = like.key;
          getLikes.likeId = getLikesId;
          likesArray.push(getLikes);
        });
      });
      dispatch(setPostsLike(likesArray));
    });
  };

    // get post Comment data
    const getGoalsComments = (parameter) => {
      db.ref(parameter).orderByChild('timestamp').on("value", (snapshot) => {
        var commentsArray = [];
        snapshot.forEach((goals) => {
          goals.forEach((like) => {
            let getComments = like.val();
            let getCommentId = like.key;
            getComments.commentId = getCommentId;
            commentsArray.push(getComments);
          });
        });
        dispatch(setPostComments(commentsArray));
      });
    };
  
  useEffect(() => {
    // condition for  if user enrolled in any organization
    if (userDetail.orgId !== "") {
      getAllUsersGoals(`organizations/${userDetail.orgId}/submitGoals`);
      getGoalsLikes(`organizations/${userDetail.orgId}/likes`);
      getGoalsComments(`organizations/${userDetail.orgId}/comments`);
      // }
    } else {
      getAllUsersGoals(`withoutOrganization/submitGoals`);
      getGoalsLikes(`withoutOrganization/likes`);
      getGoalsComments(`withoutOrganization/comments`);
    }
  }, []);

  // const [loading, setLoading] = React.useState(true)

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 1000)
  // }, [])

  return (
    <div className="feedContainer">
      <MenuAppBar />
      <div className="mobViewFeedHead">
        <div className="mobViewContent">
          <h3>My feed</h3>
          <p>All of your personalised postsin all place</p>
        </div>
        <TextsmsOutlinedIcon className="feedSmsIcon" />
      </div>
      <div className="feedMain">
        {/* {!loading? */}
        <div className="feedContent">
          <UsersGoals />
        </div>
       {/* : <LoadingState /> } */}
      </div>
    </div>
  );
};

export default Feed;
