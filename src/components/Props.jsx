import { useEffect,useState } from "react"
import Post from "./Post"
import axios from "axios"


export const PropsComponent=(props)=>{
    const [likes,setLikes]=useState([])
    const [flag,changeFlag]=useState(false)
    const [flagC,changeFlagC]=useState(false)
    const [comments,setComments]=useState([])
    useEffect(()=>{
        const fetchLikes=async()=>{
            axios.get(`${process.env.REACT_APP_SERVER_API}/like/get/${props.post.postid}`)
            .then(data=>{
                setLikes(data.data.list)
                changeFlag(true)
            })
            .catch(err=>{
                console.log(err)
            })
        }
        fetchLikes()
        const fetchComment=async()=>{
            axios.get(`${process.env.REACT_APP_SERVER_API}/comment/get/${props.post.postid}`)
            .then(res=>{
                setComments(res.data.list)
                changeFlagC(true)

            })
            .catch(err=>{
                console.log(err)
            })
        }
        fetchComment()
    } ,[flag,flagC])
    return (
        <>
            <Post
              key={props.post.postid}
              post={props.post}
              likes={likes}
              comments={comments}
              rerenderFeed={props.rerenderFeed}
              onChange={props.onChange}
            ></Post>
        </>
    )
}