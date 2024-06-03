import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/store/userSlice";
import { fetchPostCount, fetchTotalPostCount } from "../../redux/store/forumSlice";
import { format } from "date-fns";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { profile: userProfile, error, status } = useSelector((state) => state.user);
  const { postCount, totalPostCount, status: postCountStatus } = useSelector((state) => state.forum);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchTotalPostCount());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile) {
      dispatch(fetchPostCount(userProfile._id)); // Fetch post count after fetching user profile
    }
  }, [dispatch, userProfile]);

  if (status === "loading" || postCountStatus === "loading") {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-5">{error}</div>;
  }

  const profilePictureUrl = userProfile?.personalDetails?.profilePicture
    ? userProfile.personalDetails.profilePicture.startsWith("http")
      ? userProfile.personalDetails.profilePicture
      : `${apiUrl}${userProfile.personalDetails.profilePicture}`
    : "https://static.vecteezy.com/system/resources/thumbnails/019/900/322/small_2x/happy-young-cute-illustration-face-profile-png.png";

  return (
    <div className="flex h-fit border-2 shadow-lg shadow-amber-500 border-gray-400 rounded-xl flex-col items-center">
      {userProfile && (
        <>
          <div className="w-24 h-24 mt-3 p-2 rounded-full bg-gray-200 flex items-center justify-center">
            <img
              role="img"
              className="w-full h-full overflow-hidden object-cover rounded-full"
              src={profilePictureUrl}
              alt={`${userProfile.personalDetails.firstName} ${userProfile.personalDetails.lastName}`}
            />
          </div>
          <div className="border-b mt-2 w-full">
            <a
              tabIndex="0"
              className="focus:outline-none focus:opacity-75 hover:opacity-75 text-gray-800 cursor-pointer focus:underline"
            >
              <h2 className="text-xl text-center mt-4 tracking-normal font-medium mb-1">
                {userProfile.personalDetails.firstName}{" "}
                {userProfile.personalDetails.lastName}
              </h2>
              <p className="text-sm text-center mb-2 text-gray-600">
                {userProfile.contactInfo.email}
              </p>
            </a>
          </div>
          <div>
            <h2 className="text-xl text-center mt-4 mb-4 tracking-normal font-medium">
              My Posts: {postCount}
            </h2>
            <h2 className="text-xl text-center mt-4 mb-4 tracking-normal font-medium">
              Total Posts: {totalPostCount}
            </h2>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
