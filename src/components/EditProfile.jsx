import { useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NotificationManager } from "react-notifications";

function EditProfile(props) {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [description, setDescription] = useState(user.data.description);
  const [file, setFile] = useState();
  const [picture, setPicture] = useState(user.data.profilePicture);
  const [username, setUsername] = useState(user.data.username);
  const [fullname, setFullname] = useState(user.data.fullname);


  const uploadImage=async(file)=>{
    const formDataFile = new FormData();

    formDataFile.append("file", file);
    formDataFile.append("upload_preset", "raw8ntho");
    await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_UPLOAD_PRESET/image/upload",
      formDataFile
    );
  }
  const EditHandler = async (e) => {
    e.preventDefault();
    e.currentTarget.disabled = true;
    const UpdateData = { description, username, fullname };
    try {
      
      if (file) {
        UpdateData.profilePicture = await uploadImage()
      }

      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_API}/user/update/information/${user.data.userid}`,
        UpdateData,
        {
          headers: { 
            Authorization: "Bearer " + user.accessToken ,
            ContentType: "application/json"
        },
        }
      );
      console.log(res.data.user[0])
      dispatch({ type: "UPDATE_DATA", payload: res.data.user[0] });

      props.onClose();
      navigate(`/profile/${username}`);
    } catch (error) {
      // NotificationManager.error(error.response.data.message, "Warning", 3000);
      props.onClose();
    }
  };
  return (
    <EditProfileContainer>
      <div className="editProfileWrapper">
        <div className="editProfileLeft">
          <label className="fileupload" htmlFor="file">
            <img
              src={
                picture
                  ? picture
                  : "http://localhost:3002/image/defaultavatar.png"
              }
              alt=""
              className="editProfileLeftImg"
            />
            <span className="shareOptionText">Choose Picture</span>
            <input
              style={{ display: "none" }}
              type="file"
              id="file"
              accept=".png,.jpeg,.jpg"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setPicture(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </label>
        </div>
        <div className="editProfileRight">
          <form className="editProfileBox">
            <div className="editProfileBoxInput">
              Username: 
              <input
                type="text"
                className="BoxInput"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="editProfileBoxInput">
              Description: 
              <input
                type="textarea"
                className="BoxInput"
                placeholder="Bio"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="editProfileBoxInput">
              Full name:
              <input
                type="email"
                className="BoxInput"
                placeholder="full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className="editProfileBoxInput">
              <button className="editProfileButton" onClick={EditHandler}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </EditProfileContainer>
  );
}

const EditProfileContainer = styled.div`
  padding: 9px;

  .editProfileLeftImg {
    width: 150px;
    display: block;
  }
  .editProfileWrapper {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
  }
  .editProfileBox {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    background-color: white;
    padding: 20px;
  }
  .editProfileBoxInput {
    padding-bottom: 10px;
  }
  .BoxInput {
    height: 30px;
    border-radius: 5px;
    border: 1px solid gray;
    font-size: 18px;
    padding-left: 10px;
  }
  .editProfileButton {
    height: 30px;
    border-radius: 10px;
    border: none;
    background-color: black;
    color: white;
    font-size: 16px;
    padding: 0 20px;
    cursor: pointer;
  }
  .shareOptionText {
    height: 20px;
    border-radius: 10px;
    border: none;
    background-color: #3b3b3b;
    color: white;
    font-size: 16px;
    padding: 0 20px;
    cursor: pointer;
  }
  .fileupload {
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }
`;

export default EditProfile;
