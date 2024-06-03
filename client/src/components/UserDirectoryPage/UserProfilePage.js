import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserById } from "../../redux/store/userDirectorySlice";

const UserDirectoryProfilePage = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { user, status, error } = useSelector((state) => state.userDirectory);

  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  const profilePictureUrl = user.personalDetails.profilePicture
    ? user.personalDetails.profilePicture.startsWith("http")
      ? user.personalDetails.profilePicture
      : `${process.env.REACT_APP_BACKEND_URL}${user.personalDetails.profilePicture}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <div
      className="flex items-center border-2 justify-center h-screen"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url("https://www.collegebatch.com/static/clg-gallery/tezpur-university-tezpur-256627.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-row border-2 w-3/5 rounded-xl h-3/5 bg-white border-gray-600 shadow-lg items-center">
        <div className="w-full h-full flex justify-center items-center">
          <img
            src={profilePictureUrl}
            alt={`Avatar of ${user.personalDetails.firstName} ${user.personalDetails.lastName}`}
            className="object-cover h-4/5 border-2 w-4/5 rounded-full overflow-hidden"
          />
        </div>
        <div className="w-3/5 h-full p-5 flex justify-center items-center overflow-y-auto">
          <div className="text-center">
            <p className="text-2xl mb-4 font-semibold text-gray-800 pb-2">
              ALUMNI INFORMATION
            </p>
            {user.privacySettings.showEmail && (
              <div className="mb-2">
                <strong>Email:</strong> {user.contactInfo.email}
              </div>
            )}
            <div className="mb-2">
              <strong>Name:</strong> {user.personalDetails.firstName}{" "}
              {user.personalDetails.lastName}
            </div>
            {user.privacySettings.showWorkExperience && user.workExperience.length > 0 && (
              <div className="mb-2">
                <strong>Work Experience:</strong>
                <ul>
                  {user.workExperience.map((work, index) => (
                    <li key={index} className="mb-2">
                      <div><strong>Company:</strong> {work.companyName}</div>
                      <div><strong>Position:</strong> {work.position}</div>
                      <div><strong>Description:</strong> {work.description}</div>
                      <div><strong>Skills:</strong> {work.skills.join(', ')}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {user.privacySettings.showEducationHistory && user.educationHistory.length > 0 && (
              <div className="mb-2">
                <strong>Education History:</strong>
                <ul>
                  {user.educationHistory.map((education, index) => (
                    <li key={index} className="mb-2">
                      {/*<div><strong>Institution:</strong> {education.institutionName}</div>*/}
                      <div><strong>Degree:</strong> {education.degree}</div>
                      <div><strong>Department:</strong> {education.department}</div>
                      <div><strong>Programme:</strong> {education.programme}</div>
                      <div><strong>Year of Graduation:</strong> {education.yearOfGraduation}</div>
                      <div><strong>Activities:</strong> {education.activities.join(', ')}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDirectoryProfilePage;
