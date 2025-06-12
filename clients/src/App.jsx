import React, { useState } from 'react'
import { IoMdCloudUpload } from "react-icons/io";

const App = () => {

  const [img, setImg]=useState('')

  const imagebase64=(file) =>{
    const reader =new FileReader()
    reader.readAsDataURL(file)
    const data =new Promise((resolve,reject) =>{
      reader.onload =() =>resolve(reader.result)
      reader.onerror=(err) =>reject(err)
    })
    return data
  }

  const handleUploadImage= async (e) =>{
    const file =e.target.files[0]
    const image=await imagebase64(file)
    setImg(image)
  }

  return (
    <>
      <div className='imageContainer'>
        <form>
          <label htmlFor='uploadImage'>
            <div className='uploadBox'>
              <input type='file' id='uploadImage' onChange={handleUploadImage} />
              {img ? <img src={img} alt="Uploaded preview"  /> :<IoMdCloudUpload />}

            </div>
          </label>
          <div className='btn'>
            <button>Upload</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default App