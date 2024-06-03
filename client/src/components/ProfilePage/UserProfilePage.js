import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/store/userSlice"; // Adjust the path to match your project structure
import { format } from "date-fns";

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { profile: userProfile, error, status } = useSelector((state) => state.user);
  const apiUrl = process.env.REACT_APP_BACKEND_URL; // Using environment variable for API base URL

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy"); // Example format: Jan 1, 2020. Adjust as needed.
  };

  useEffect(() => {
    dispatch(fetchUserProfile()); // Ensure user is authenticated before dispatching
  }, [dispatch]);

  if (status === "loading") {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-5">{error}</div>;
  }

  const renderProfileDetails = () => {
    if (!userProfile) return null;

    const profilePictureUrl = userProfile.personalDetails.profilePicture
      ? userProfile.personalDetails.profilePicture.startsWith("http")
        ? userProfile.personalDetails.profilePicture
        : `${apiUrl}${userProfile.personalDetails.profilePicture}`
      : "https://static.vecteezy.com/system/resources/thumbnails/019/900/322/small_2x/happy-young-cute-illustration-face-profile-png.png";

    const commonDetails = (
      <div className="text-center mb-4">
        <div className="relative">
          <img
            tabIndex="0"
            className="focus:outline-none h-56 shadow rounded-t border-2 w-full object-cover object-center"
            src="https://tuk-cdn.s3.amazonaws.com/assets/components/grid_cards/gc_29.png"
            alt="mountains cover"
          />
          <img
            src={profilePictureUrl}
            alt={`${userProfile.personalDetails.firstName} ${userProfile.personalDetails.lastName}`}
            className="rounded-md h-32 w-32 mx-auto border-2 absolute bottom-0 -mb-12 left-1/2 transform -translate-x-1/2"
            onError={(e) => {
              console.error("Image load error: ", e);
              console.log("Image URL: ", profilePictureUrl);
            }}
          />
        </div>
        <h2 className="text-lg font-semibold mt-16">
          {userProfile.personalDetails.firstName} {userProfile.personalDetails.lastName}
        </h2>
        <p className="text-sm text-gray-600">{userProfile.contactInfo.email}</p>
        <Link
          to={`/edit-profile/${userProfile._id}`}
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Edit Profile
        </Link>
        <Link
          to={`/update-privacy/${userProfile._id}`}
          className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300 ml-2"
        >
          Privacy Settings
        </Link>
      </div>
    );

    const educationHistory = (
      <div className="bg-white border-2 border-indigo-500 shadow rounded w-full md:w-auto">
        <div className="p-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Education History</h3>
          {userProfile.educationHistory.length > 0 ? (
            userProfile.educationHistory.map((education, index) => (
              <div key={index} className="mb-3">
                <p><strong>Institution:</strong> {education.institutionName}</p>
                <p><strong>Degree:</strong> {education.degree}</p>
                <p><strong>Department:</strong> {education.department}</p>
                <p><strong>Programme:</strong> {education.programme}</p>
                <p><strong>Year of Graduation:</strong> {education.yearOfGraduation}</p>
                <p><strong>Activities:</strong> {education.activities.join(", ") || "N/A"}</p>
              </div>
            ))
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>
    );

    const workExperience = (
      <div className="bg-white border-2 border-indigo-500 shadow rounded w-full md:w-auto">
        <div className="p-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Work Experience</h3>
          {userProfile.workExperience.length > 0 ? (
            userProfile.workExperience.map((work, index) => (
              <div key={index} className="mb-3">
                <p><strong>Company:</strong> {work.companyName}</p>
                <p><strong>Position:</strong> {work.position}</p>
                <p><strong>Start Date:</strong> {formatDate(work.startDate)}</p>
                <p><strong>End Date:</strong> {work.endDate ? formatDate(work.endDate) : "Current"}</p>
                <p><strong>Description:</strong> {work.description || "N/A"}</p>
                <p><strong>Skills:</strong> {work.skills.join(", ") || "N/A"}</p>
              </div>
            ))
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>
    );

    const contactInformation = (
      <div className="bg-white border-2 border-indigo-500 shadow rounded w-full md:w-auto">
        <div className="p-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Contact Information</h3>
          <p><strong>Phone:</strong> {userProfile.contactInfo.phone || "N/A"}</p>
          <p><strong>Address:</strong> {userProfile.contactInfo.address || "N/A"}</p>
        </div>
      </div>
    );

    const additionalDetails = () => {
      switch (userProfile.userType) {
        case 'admin':
          return (
            <div className="bg-white border-2 border-indigo-500 shadow rounded w-full md:w-auto">
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Admin Details</h3>
                <p><strong>Department Managed:</strong> {userProfile.roleDetails?.departmentManaged || "N/A"}</p>
                <p><strong>Permissions:</strong> {userProfile.roleDetails?.permissions?.join(", ") || "N/A"}</p>
              </div>
            </div>
          );
        case 'faculty':
          return (
            <div className="bg-white border-2 border-indigo-500 shadow rounded w-full md:w-auto">
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Faculty Details</h3>
                <p><strong>Department:</strong> {userProfile.roleDetails?.department || "N/A"}</p>
                <p><strong>Title:</strong> {userProfile.roleDetails?.title || "N/A"}</p>
                <p><strong>Courses Taught:</strong> {userProfile.roleDetails?.coursesTaught?.join(", ") || "N/A"}</p>
                <p><strong>Research Interests:</strong> {userProfile.roleDetails?.researchInterests?.join(", ") || "N/A"}</p>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <>
        {commonDetails}
        <div className="flex flex-wrap justify-center gap-4">
          {educationHistory}
          {workExperience}
          {contactInformation}
          {additionalDetails()}
        </div>
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow rounded-lg border-2 border-sky-200 mt-5 space-y-4">
      {renderProfileDetails()}
    </div>
  );
};

export default UserProfilePage;
