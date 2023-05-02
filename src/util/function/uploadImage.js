import axios from "axios";

export const uploadImage=async(file)=>{

    const formDataFile = new FormData();
    formDataFile.append("file", file,"file");
    
    const img = await axios.post(
      `${process.env.REACT_APP_SERVER_API}/files/upload`,
          formDataFile
      ,
      {
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return img
}