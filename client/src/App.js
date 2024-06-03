import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './styles/index.css';
import RegisterPage from './components/RegistrationPage/RegistrationPage';
import Navbar from './components/common/Navbar/Navbar';
import { SidebarWithContentSeparator } from './components/common/LeftNavbar/LeftNavbar';
import LandingPage from './components/LandingPage/LandingPage';
import Footer from './components/common/Footer/Footer';
import LoginPage from './components/LoginPage/LoginPage';
import DashboardPage from './components/DashboardPage/DashboardPage';
import ForumPage from './components/ForumPage/ForumPage';
import LogoutPage from './components/LogOutPage/LogOutPage';
import Signup from './components/Signup/Signup';
import UploadPage from './components/UploadUserPage/UploadPage';
// import ChatPage from './components/ChatPage/ChatPage';
import DonationPage from './components/DonationPage/DonationPage';
// import MakeDonationPage from './components/DonationPage/MakeDonationPage';
// Import the job components
// Correct the paths according to the actual component definitions
import JobListPage from './components/JobPostingPage/JobListPage';
import CreateJobPage from './components/JobPostingPage/CreateJobPage'; // Create job page
import JobDetailsPage from './components/JobPostingPage/JobDetailsPage'; // Job details page
import EditJobPage from './components/JobPostingPage/EditJobPage';
// import UploadCSV from './components/UploadCSV/UploadCSV';
import Contact from './components/ContactUs/ContactUs';
// Import the event components
import EventListPage from './components/EventPage/EventListPage';
import CreateEventPage from './components/EventPage/CreateEventPage';
import EditEventPage from './components/EventPage/EditEventPage';
import EventDetailsPage from './components/EventPage/EventDetailsPage';
import UpcomingEventPage from './components/EventPage/UpcomingEventPage';
import PastEventPage from './components/EventPage/PastEventPage';

import EditProfilePage from './components/ProfilePage/EditProfilePage';
import PrivacySettingsPage from './components/ProfilePage/PrivacySettingPage';
import UserProfilePage from './components/ProfilePage/UserProfilePage';

import UserDirectoryPage from './components/UserDirectoryPage/UserDirectoryPage';
import UserDirectoryProfilePage from './components/UserDirectoryPage/UserProfilePage';

import PreUserPage from './components/PreUserPage/PreUserPage';

import ChatPage from './components/ChatPage/ChatPage'; // Adjust path based on your structure
import MakeDonationPage from './components/DonationPage/MakeDonationPage';
import DonationAnalyticsComponent from './components/DonationPage/donationAnalytics';
import DonationHistory from './components/DonationPage/DonationHistory';
import AboutUs from './components/AboutPage/AboutPage';
import ContactUs from './components/ContactUs/ContactUs';

import AdminForm from './components/PreUserPage/AdminForm';
import AlumniForm from './components/PreUserPage/AlumniForm';
import FacultyForm from './components/PreUserPage/FacultyForm';
import StudentForm from './components/PreUserPage/StudentForm';

import RequestPasswordResetPage from './components/PasswordResetPage/RequestPasswordResetPage';
import PasswordResetPage from './components/PasswordResetPage/PasswordResetPage';

import NotificationsComponent from './components/NotificationPage/NotificationComponent';

import PostDetailsPage from './components/ForumPage/PostDetailsPage';

import GalleryPage from './components/GalleryPage/GalleryPage';
import GalleryUploadPage from './components/GalleryPage/UploadPage';

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const authLoading = useSelector(state => state.auth.loading); // Assuming you have a loading state

  if (authLoading) {
    return <div>Loading...</div>; // Show a loader while checking authentication state
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        {isAuthenticated && (
          <div className="flex flex-col h-full md:flex-row">
            <SidebarWithContentSeparator className="md:w-1/4 h-full" />
            <div className="flex flex-col mt-15 w-full">
              <div className="w-full h-100vh py-5  px-4">
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/forum" element={<ForumPage />} />
                  <Route path="/logout" element={<LogoutPage />} />
                  {/* <Route path="/upload" element={<UploadCSV />} /> */}
                  <Route path="/donation" element={<DonationPage />} />
                  <Route path="/donation-analytics" element={<DonationAnalyticsComponent />} />
                  <Route path="/make-donation" element={<MakeDonationPage />} />
                  <Route path="/donation-history" element={<DonationHistory />} />
                  <Route path="/upload-students" element={<UploadPage />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  {/* Protected Job Routes */}
                  
                  <Route path="/jobs/create" element={<CreateJobPage />} />
                  <Route path="/jobs/edit/:jobId" element={<EditJobPage />} />
                  <Route path="/jobs" element={<JobListPage />} />
                  <Route path="/jobs/:jobId" element={<JobDetailsPage />} />

                  {/* Protected Event Routes */}
                  <Route path="/events/create" element={<CreateEventPage />} />
                  <Route path="/events/edit/:eventId" element={<EditEventPage />} />
                  <Route path="/events" element={<EventListPage />} />
                  <Route path="/events/:eventId" element={<EventDetailsPage />} />
                  
                  <Route path="/events/upcoming" element={<UpcomingEventPage />} />
                  <Route path="/events/past" element={<PastEventPage />} />
                  {/* More protected routes as needed */}

                  <Route path="/edit-profile/:userId" element={<EditProfilePage />} />
                  <Route path="/update-privacy/:userId" element={<PrivacySettingsPage />} />
                  <Route path="/profile/:userId" element={<UserProfilePage />} />
                  <Route path="/messages" element={<ChatPage />} />

                  {/* Add User Directory route */}
                  <Route path="/user-directory" element={<UserDirectoryPage />} />
                  <Route path="/user-directory/profile/:userId" element={<UserDirectoryProfilePage />} />

                  <Route path="/preuser" element={<PreUserPage />} />

                  <Route path="/create-admins" element={<AdminForm />} />
                  <Route path="/create-alumni" element={<AlumniForm />} />
                  <Route path="/create-faculty" element={<FacultyForm />} />
                  <Route path="/create-students" element={<StudentForm />} />

                  <Route path="/notifications" element={<NotificationsComponent />} />

                  <Route path="/posts/:postId" element={<PostDetailsPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/upload-gallery" element={<GalleryUploadPage />} />

                  {/* More protected routes as needed */}
                </Routes>
              </div>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Conditional rendering based on authentication state */}
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/request-reset-password" element={<RequestPasswordResetPage />} />
          <Route path="/reset-password/:token" element={<PasswordResetPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
