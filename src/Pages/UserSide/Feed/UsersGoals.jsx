import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import firebase from '../../../Config/FirebaseConfig'
import SendIcon from '@material-ui/icons/Send'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { send } from 'emailjs-com'
import AlertDialog from '../../../Components/AlertPopup'
import dp from '../../../Assets/dp.png'

const UsersGoals = () => {
  const db = firebase.database()

  const selector = useSelector((state) => {
    return state
  })
  const { goalReducer, userReducer } = selector
  // like post
  const handleLikePost = (event, likeEvent) => {
    const checkIsPostLike = userReducer.postLikes.filter(
      (posts) =>
        posts.goalId === event.orgMainId &&
        posts.uid === goalReducer.currentUser.id,
    )
    // console.log(event)
    // if user enrolled in org
    if (goalReducer.currentUser.orgId !== '') {
      if (checkIsPostLike.length) {
        db.ref(
          `organizations/${goalReducer.currentUser.orgId}/likes/${event.orgMainId}/${likeEvent.likeId}`,
        ).update({
          isLike: true,
        })
        // likes increament
        db.ref(
          `organizations/${goalReducer.currentUser.orgId}/submitGoals/${event.orgMainId}`,
        ).update({
          likes: event.likes ? event.likes + 1 : 1,
        })
      } else {
        db.ref(
          `organizations/${goalReducer.currentUser.orgId}/likes/${event.orgMainId}`,
        )
          .push()
          .set({
            uid: goalReducer.currentUser.id,
            isLike: true,
            goalId: event.orgMainId,
          })
        db.ref(
          `organizations/${goalReducer.currentUser.orgId}/submitGoals/${event.orgMainId}`,
        ).update({
          likes: event.likes ? event.likes + 1 : 1,
        })
      }
    }
    // if user is not enrolled in org
    else {
      if (checkIsPostLike.length) {
        db.ref(
          `withoutOrganization/likes/${event.orgMainId}/${likeEvent.likeId}`,
        ).update({
          isLike: true,
        })
        // likes increament
        db.ref(`withoutOrganization/submitGoals/${event.orgMainId}`).update({
          likes: event.likes ? event.likes + 1 : 1,
        })
      } else {
        db.ref(`withoutOrganization/likes/${event.orgMainId}`).push().set({
          uid: goalReducer.currentUser.id,
          isLike: true,
          goalId: event.orgMainId,
        })
        db.ref(
          `organizations/${goalReducer.currentUser.orgId}/submitGoals/${event.orgMainId}`,
        ).update({
          likes: event.likes ? event.likes + 1 : 1,
        })
      }
    }
  }

  // unlike post
  const handleUnlikePost = (event, subEvent) => {
    // console.log(event)
    if (goalReducer.currentUser.orgId !== '') {
      db.ref(
        `organizations/${goalReducer.currentUser.orgId}/likes/${event.goalId}/${event.likeId}`,
      ).update({
        isLike: false,
      })
      // decreament like
      db.ref(
        `organizations/${goalReducer.currentUser.orgId}/submitGoals/${subEvent.orgMainId}`,
      ).update({
        likes: subEvent.likes - 1,
      })
    } else {
      db.ref(
        `withoutOrganization/likes/${event.goalId}/${event.likeId}`,
      ).update({
        isLike: false,
      })
      db.ref(`withoutOrganization/submitGoals/${subEvent.orgMainId}`).update({
        likes: subEvent.likes - 1,
      })
    }
  }

  // post report
  let [loading, setLoading] = useState(false)
  let [reportSuccesPopup, setReportSuccesPopup] = useState(false)
  let [reportGoalId,setReportGoalId] = useState('')
  const handleReportPost = (event) => {
    setReportGoalId(event.orgMainId)
    setLoading(true)
    const reportedUserName = goalReducer.currentUser.name
    // console.log(reportedUserName, event)
    // const filterUserEmailToSendNotification =
    userReducer.allUsers.filter((user) => {
      if (user.id === event.userIdMain) {
        // console.log(user)
        send(
          // process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
          // process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
          'service_q1galup',
          'template_aq5fbiv',
          {
            to: `${user.email}`,
            to_name: `${event.userName}`,
            from_email_name: 'TRYVE',
            subject: '',
            message: `${reportedUserName} reported your goal please retake good picture. Thanks!`,
            from: 'ansariwaqas310@gmail.com',
            reply_to: 'tryve@gmail.com',
          },
          process.env.REACT_APP_EMAIL_JS_USER_ID,
        )
          .then(() => {
            console.log('success...')
          })
          .catch((err) => {
            console.log('admin Email sending FAILED...', err)
          })
      }
    })
    if (goalReducer.currentUser.orgId !== '') {
      db.ref(
        `organizations/${goalReducer.currentUser.orgId}/submitGoals/${event.orgMainId}`,
      )
        .update({ isReport: true, acceptReport: false })
        .then(() => {
          setLoading(false)
          setReportSuccesPopup(true)
        })
    } else {
      db.ref(`withoutOrganization/submitGoals/${event.orgMainId}`)
        .update({
          isReport: true,
          acceptReport: false,
        })
        .then(() => {
          setLoading(false)
          setReportSuccesPopup(true)
        })
    }
  }

  // show comment section
  let [showComment, setShowComment] = React.useState(false)
  let [comment, setComment] = React.useState('')
  let [postId, setPostId] = React.useState('')
  let [commentLoad, setCommentLoad] = React.useState(false)
  const bottomRef = useRef(null)
  // show comment section function
  const handleCommentShow = (event) => {
    setShowComment(!showComment)
    if (event.orgMainId === postId) {
      setPostId('')
    } else {
      setPostId(event.orgMainId)
    }
  }
  // set comment input value
  const handleComment = (event) => {
    setComment(event.target.value)
  }
  

  // set comment in database
  const handleAddComment = (event) => {
    setCommentLoad(true)
    console.log(event, goalReducer.currentUser)
    if (comment.length > 0) {
      if (goalReducer.currentUser.orgId !== '') {
        db.ref(
          `organizations/${goalReducer.currentUser.orgId}/comments/${event.orgMainId}`,
        )
          .push()
          .set({
            uid: goalReducer.currentUser.id,
            userName: goalReducer.currentUser.name,
            userImg: goalReducer.currentUser.url
              ? goalReducer.currentUser.url
              : '',
            comment: comment,
            goalId: event.orgMainId,
          })
        setComment('')
        setCommentLoad(false)
      } else {
        db.ref(`withoutOrganization/comments/${event.orgMainId}`)
          .push()
          .set({
            uid: goalReducer.currentUser.id,
            userName: goalReducer.currentUser.name,
            userImg: goalReducer.currentUser.url
              ? goalReducer.currentUser.url
              : '',
            comment: comment,
            goalId: event.orgMainId,
          })
        setComment('')
        setCommentLoad(false)
      }
    }
    // else {
    //   alert('please enter comment')
    // }
  }

  const scrollToBottom = () => {
    if (postId || commentLoad) {
      // bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }


  React.useEffect(scrollToBottom, [postId, commentLoad,handleAddComment])
  
  // delete comment
  const handleDeleteComment = (event) => {
    if (goalReducer.currentUser.orgId !== '') {
      db.ref(
        `organizations/${goalReducer.currentUser.orgId}/comments/${event.goalId}/${event.commentId}`,
      ).remove()
    }
  }

  const handleClosePopup = () => {
    setReportSuccesPopup(false)
  }

  return (
    <div className="feedGoalsContainer">
      {reportSuccesPopup ? (
        <AlertDialog
          handleClose={handleClosePopup}
          open={reportSuccesPopup}
          value="Reported Successfull"
          btnValue="OK"
        />
      ) : null}
      <div className="feedGoalsContent">
        <div className="feedGoals ">
          {userReducer.feedGoals.length ? (
            userReducer.feedGoals.map((val, i) => {
              // console.log(val)
              return (
                <div
                  className={
                    i % 2 !== 0
                      ? 'horizontal feedGoalGrid'
                      : 'vertical feedGoalGrid'
                  }
                  key={i}
                >
                  <div className="imgLikeBtn">
                    <img
                      className="feedGoalImg"
                      src={val.uploadImgUlr}
                      alt="..."
                    />
                    {userReducer.postLikes.map((like, j) => {
                      return like.goalId === val.orgMainId &&
                        like.uid === goalReducer.currentUser.id ? (
                        <button
                          className="likeBtn likeZ"
                          onClick={
                            !like.isLike
                              ? () => handleLikePost(val, like)
                              : () => handleUnlikePost(like, val)
                          }
                          key={j}
                        >
                          <ThumbUpAltOutlinedIcon
                            className={like.isLike ? 'liked' : 'unlike'}
                          />
                        </button>
                      ) : null
                    })}
                    <button
                      className="likeBtn"
                      onClick={() => handleLikePost(val, false)}
                    >
                      <ThumbUpAltOutlinedIcon className={'unlike'} />
                    </button>
                  </div>
                  <div className="cmntAndReportBtn">
                    <div className="noOfLikes">
                      <p>{val.likes ? val.likes + ' Likes' : '0 Likes'}</p>
                    </div>
                    <button
                      onClick={() => handleCommentShow(val)}
                      className="cmntBtn"
                    >
                      Comment
                    </button>
                    <button
                      className={val.userIdMain===goalReducer.currentUser.id?'disabled reportBtn' :"reportBtn"}
                      onClick={() => handleReportPost(val)}
                      disabled={loading || val.userIdMain===goalReducer.currentUser.id }
                    >
                      {loading && reportGoalId===val.orgMainId ? 'loading...' : 'Report'}
                    </button>
                  </div>
                  {val.orgMainId === postId ? (
                    <div className="commentSection">
                      <ul className="commmentList">
                        {userReducer.comments.length ? (
                          userReducer.comments.map((commentval, k) => {
                            return commentval.goalId === val.orgMainId ? (
                              <li key={k}>
                                <img
                                  src={
                                    commentval.userImg ? commentval.userImg : dp
                                  }
                                  alt="..."
                                />
                                <div className="comments">
                                  <div className="cmntLines">
                                    <h6>{commentval.userName}</h6>
                                    <p>{commentval.comment}</p>
                                  </div>
                                  {commentval.uid ===
                                  goalReducer.currentUser.id ? (
                                    <button
                                      className="dltBtn"
                                      onClick={() =>
                                        handleDeleteComment(commentval)
                                      }
                                      >
                                      <DeleteForeverIcon className="dltIcon" />
                                    </button>
                                  ) : null}
                                </div>
                                  <p className="strtBtm" ref={bottomRef}></p>
                              </li>
                            ) : null
                          })
                        ) : (
                          <p>There is no comment!</p>
                        )}
                      </ul>
                      <div className="commentInput">
                        <input
                          type="text"
                          name="comment"
                          id="comment"
                          placeholder="Comment"
                          onChange={handleComment}
                          value={comment}
                        />
                        <button onClick={() => handleAddComment(val)}>
                          <SendIcon className="sentIcon" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })
          ) : (
            <p>list is empty</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersGoals
