import React, { useState, useEffect } from 'react';
import { IoMdCloudUpload } from "react-icons/io";

const App = () => {
  const [img, setImg] = useState('');
  const [status, setStatus] = useState('');
  const [allImage, setAllImage] = useState([]);

  // Convert image file to base64
  const imagebase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  // Handle image selection
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const image = await imagebase64(file);
      setImg(image);
    }
  };

  // Fetch all images from server
  const fetchimage = async () => {
    try {
      const res = await fetch("http://localhost:8080/");
      const data = await res.json();
      setAllImage(data.data || []);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  // Upload image to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (img) {
      try {
        const res = await fetch("http://localhost:8080/upload", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: img }),
        });

        const data = await res.json();
        setStatus(data.message || "Uploaded");
        setImg('');
        fetchimage(); // Refresh image list
      } catch (err) {
        console.error("Upload failed:", err);
        setStatus("Upload failed");
      }
    }
  };

  // Delete image by ID
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      setStatus(data.message || "Deleted");
      fetchimage(); // Refresh image list
    } catch (err) {
      console.error("Delete failed:", err);
      setStatus("Delete failed");
    }
  };

  useEffect(() => {
    fetchimage();
  }, []);

  return (
    <div className="imageContainer">
      <form onSubmit={handleSubmit}>
        <label htmlFor="uploadImage">
          <div className="uploadBox">
            <input
              type="file"
              id="uploadImage"
              onChange={handleUploadImage}
              accept="image/*"
            />
            {img ? (
              <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <IoMdCloudUpload size={50} />
            )}
          </div>
        </label>
        <div className="btn">
          <button type="submit">Upload</button>
        </div>
       
      </form>

      {/* Image Gallery */}
      <div className="gallery">
        {allImage.length > 0 ? (
          allImage.map((item, index) => (
            <div className="galleryItem" key={item._id}>
              <img src={item.image} alt={`Uploaded-${index}`} />
              <button onClick={() => handleDelete(item._id)}>×</button>
            </div>
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default App;
