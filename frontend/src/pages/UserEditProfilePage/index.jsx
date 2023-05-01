import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UI/Navbars/UserNavbar";
import "./style.css";

const UserProfileUpdate = () => {
  const [profileData, setProfileData] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    const requestOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    fetch("http://localhost:8000/accounts/profile/", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Not authenticated");
        }
      })
      .then((data) => {
        setProfileData(data);
        setUpdatedData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
        });
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        navigate("/login");
      });
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const accessToken = localStorage.getItem("access");
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    };

    fetch("http://localhost:8000/accounts/profile/", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error updating profile");
        }
      })
      .then((data) => {
        console.log("Profile updated:", data);
        if (avatarFile) {
          localStorage.setItem("avatar", data.avatar);
        }
        navigate("/userprofile");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <>
      {profileData && (
        <div>
          <UserNavbar />
          <div className="container host-profile-update-form">
            <header>Update User Profile</header>
            <form onSubmit={handleSubmit}>
              <div className="form first">
                <div className="details personal">
                  <div className="fields">
                    <div className="input-field">
                      <label>First Name</label>
                      <input
                        type="text"
                        placeholder="First Name"
                        name="first_name"
                        value={updatedData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-field">
                      <label>Last Name</label>
                      <input
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        value={updatedData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-field">
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={updatedData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-field">
                      <label>Phone</label>
                      <input
                        type="text"
                        placeholder="Phone"
                        name="phone"
                        value={updatedData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-field-file">
                      <label>Profile Picture</label>
                      <input type="file" onChange={handleFileChange} />
                    </div>
                  </div>
                </div>
    
                <div className="buttons">
                  <button
                    type="button"
                    className="submit"
                    onClick={() => navigate("/userprofile")}
                  >
                    <span className="btnText">Back</span>
                  </button>
                  <button type="submit" className="submit">
                    <span className="btnText">Submit</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>

);
};

export default UserProfileUpdate;
