import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { FiMoreVertical } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext/AuthContext";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "./UI/Modal";
import ShowPost from "./ShowPost";
import { NotificationManager } from "react-notifications";
import { format } from "timeago.js";
import Backdrop from "./UI/Backdrop";

function Post(props) {
  const post = props.post;
  post.comment=[]
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(props.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [Countcomments, setCountComments] = useState(post.comment.length);
  const [showPost, setShowPost] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const listUserLike = props.likes?.map((p)=>{
      return p.userid 
    })
    setIsLiked(listUserLike.includes(user.data.userid));
    setLikes(props.likes.length)
  }, [props.likes]);

  const deleteHandler = async () => {
    try {

      await axios.delete(`http://localhost:8000/api/article/${post._id}`, {
        headers: { Authorization: "Bearer " + user.data.accessToken.accessToken },
      });
      NotificationManager.success("Success", "Post has been deleted", 3000);
      props.onChange(1);
    } catch (error) {
      NotificationManager.warning("Warning", "error", 3000);
    }
  };

  
  const likeHandler = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_API}/like/post/${post.postid}`,{
          userid:user.data.userid,
          postid:post.postid
      } ,
      {
        headers: { 
          Authorization: "Bearer " + user.data.accessToken.accessToken, 
          ContentType: "application/json"
        },
      });
    } catch (error) {}

    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };
  const setcommentHandler = () => {
    setCountComments(Countcomments + 1);
  };
  const showMenuHandler = () => {
    setShowMenu(!showMenu);
  };
  return (
    <>
      {showMenu && <Backdrop onClose={showMenuHandler} />}
      {showPost && (
        <Modal
          onClose={() => {
            setShowPost(false);
          }}
        >
          <ShowPost post={post} newComment={setcommentHandler}></ShowPost>
        </Modal>
      )}
      <PostContainer>
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={"/profile/" + post.user?.username}>
              <img
                src={post.avatar}
                alt=""
                className="postProfileImg"
              />
            </Link>

            <Link
              style={{ textDecoration: "none", color: "#000000" }}
              to={"/profile/" + post.user?.username}
            >
              <span className="postUsername">{post.username}</span>
            </Link>
            <span className="postDate">{format(post?.createdAt)}</span>
          </div>
          <div className="postTopright">
            <FiMoreVertical
              onClick={() => {
                setShowMenu(!showMenu);
              }}
            />
            {showMenu && (
              <div className="topRightPanel" onClick={deleteHandler}>
                Delete
              </div>
            )}
          </div>
        </div>
        <hr className="hrh" />
        <div className="postCenter">
          <p className="postText">{post.description}</p>
          <div className="postImgWrapper">
            <img
              src={post.imageurl ? post.imageurl : "DEFAULT_IMG_URL"}
              alt=""
              className="postImg"
            />
          </div>
        </div>
        <hr className="hrh" />
        <div className="postBottom">
          <div className="postBottomLeft">
            <AiFillHeart
              onClick={likeHandler}
              className="likeIcon"
              color={isLiked ? "red" : "#e0e0e0ed"}
            />
            <span
              className="postLikeCounter"
              onClick={() => {
                setShowPost(true);
              }}
            >
              {likes} Likes {Countcomments} Comments
            </span>
          </div>
        </div>
      </PostContainer>
    </>
  );
}
const PostContainer = styled.div`
  width: 99%;
  border-radius: 10px;
  border: 1px solid rgb(211, 211, 211);
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  margin-top: 10px;
  margin-bottom: 50px;
  .postTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
  }
  .postTopright {
    position: relative;
  }
  .topRightPanel {
    position: absolute;
    background-color: #eaeaea;
    width: 80px;
    height: 30px;
    right: 5px;
    z-index: 60;
    border-radius: 5px;
    border: 1px solid rgb(211, 211, 211);
    -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    padding-top: 10px;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
  }
  .postTopLeft {
    display: flex;
    align-items: center;
  }
  .postProfileImg {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  .postUsername {
    font-size: 15px;
    font-weight: 500;
    padding: 0 10px;
  }
  .postDate {
    font-size: 10px;
    font-weight: 500;
  }
  .postImgWrapper {
    padding-right: 3px;
    padding-left: 3px;
  }
  .postImg {
    padding-top: 5px;
    width: 100%;
    object-fit: contain;
  }
  .postCenter {
    display: flex;
    flex-direction: column;
  }
  .postText {
    padding-top: 5px;
    padding-bottom: 3px;
    font-weight: 400;
    font-size: 15px;
    padding-left: 4px;
  }
  .postBottom {
    padding-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 4px;
  }
  .postBottomLeft {
    display: flex;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
  }
  .likeIcon {
    font-size: 30px;
    padding-right: 5px;
    cursor: pointer;
  }
  .postLikeCounter {
    font-size: 15px;
  }
  .hrh {
    opacity: 0.4;
  }
`;
export default Post;
