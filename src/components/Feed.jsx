import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { SpinnerDotted } from "spinners-react";
import { AuthContext } from "../contexts/AuthContext/AuthContext";
import { PropsComponent } from "./Props";

function Feed(props) {
  const { user } = useContext(AuthContext);
  const [loadingNewPosts, setLoadingNewPosts] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const listInnerRef = useRef();
  const [wasLastList, setWasLastList] = useState(false);


  useEffect(() => {
    if (props.rerenderFeed === 1) {
      setCurrPage(1);
      setPrevPage(0);
      setPosts([]);
      setWasLastList(false);
    }
    props.onChange(0);
    const fetchPosts = async () => {

      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/post/get/1`,
        { headers: { Authorization: "Bearer " + user.data.accessToken.accessToken } }
      );
      setPosts(res.data.list)
       
    };
    if (!wasLastList && prevPage !== currPage) {
      fetchPosts();
    }
  }, [
    currPage,
    wasLastList,
    prevPage,
    loadingNewPosts,
    user.accessToken,
    props,
  ]);
  
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage(currPage + 1);
      }
    }
  };
  return (
    <>
      <FeedContainer>
        <div 
        // onScroll={onScroll} 
        // ref={listInnerRef} 
        className="FeedWrapper">
          <>
          {posts.map( (p) => 

              ( 
              <PropsComponent
              key={p.postid}
              post={p}
              rerenderFeed={props.rerenderFeed}
              onChange={props.onChange}
              >
                
              </PropsComponent>
              )
              )}
            </>
{/* 
          {loadingNewPosts && (
            <center>
              <SpinnerDotted color="rgb(0,149,246)" />
            </center>
          )} */}
        </div>
      </FeedContainer>
    </>
  );
}

const FeedContainer = styled.div`
  width: 500px;
  .FeedWrapper {
    scroll-behavior: smooth;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 13px;
      height: 13px;
    }
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(13deg, #f9d4ff 14%, #c7ceff 64%);
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(13deg, #c7ceff 14%, #f9d4ff 64%);
    }
    &::-webkit-scrollbar-track {
      background: red;
      border-radius: 10px;
      box-shadow: inset 7px 10px 12px #f0f0f0;
    }
  }
`;

export default Feed;
