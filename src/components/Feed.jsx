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
        <div onScroll={onScroll} ref={listInnerRef} className="FeedWrapper">
          {posts.map( (p) => 

            (  
            <PropsComponent
              key={p.postid}
              post={p}
              rerenderFeed={props.rerenderFeed}
              onChange={props.onChange}
            ></PropsComponent>
            )
          )}

          {loadingNewPosts && (
            <center>
              <SpinnerDotted color="rgb(0,149,246)" />
            </center>
          )}
        </div>
      </FeedContainer>
    </>
  );
}

const FeedContainer = styled.div`
  width: 500px;
  .FeedWrapper {
    height: calc(100vh - 63px);
    overflow-y: auto;
    padding: 5px;
    ::-webkit-scrollbar {
      width: 0px;
    }
    ::-webkit-scrollbar-track {
      background-color: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgb(192, 192, 192);
    }
  }
`;

export default Feed;
