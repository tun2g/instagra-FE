import { useEffect,useState } from "react"
import Post from "./Post"
import axios from "axios"


export const PropsComponent=(props)=>{
    const [likes,setLikes]=useState([])
    const [flag,chanegFlag]=useState(false)
    useEffect(()=>{
        const fetch=async()=>{
            axios.get(`${process.env.REACT_APP_SERVER_API}/like/get/${props.post.postid}`)
            .then(data=>{
                setLikes(data.data.list)
                chanegFlag(true)
                console.log(data.data.list)
            })
            .catch(err=>{
                console.log(err)
            })
        }
        fetch()

    } ,[flag])
    return (
        <>
            <Post
              key={props.post.postid}
              post={props.post}
              likes={likes}
              rerenderFeed={props.rerenderFeed}
              onChange={props.onChange}
            ></Post>
        </>
    )
}