import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, deleteJob } from '../../redux/store/jobSlice';
import { Link } from 'react-router-dom';
import { selectUserType } from '../../redux/store/authSlice'; // Import selectUserType

const JobListPage = () => {
  const dispatch = useDispatch();
  const { jobs, status, error } = useSelector((state) => state.jobs);
  const userType = useSelector(selectUserType); // Use the selector to get the user type
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleDelete = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      dispatch(deleteJob(jobId));
    }
  };

  if (status === 'loading') return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-5">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl text-center font-bold mb-6">Job Listings</h2>
      {userType !== 'student' && (
        <Link to="/jobs/create" className="mb-4 block text-center bg-blue-500 text-white py-2 rounded">Create Job</Link>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded shadow-md">
            <div className="h-48 w-full">
              <img
                className="w-full h-full object-cover rounded"
                alt="job"
                src={job.image ? `${apiUrl}${job.image}` : 'https://img.freepik.com/premium-psd/we-are-hiring-job-vacancy-social-media-post-template_504779-82.jpg'}
              />
            </div>
            <h1 className="text-2xl font-medium mt-2">{job.title}</h1>
            <p className="text-gray-600 text-sm mt-1">{job.description}</p>
            <p className="text-gray-600 text-sm mt-1"><strong>Last Date to Apply:</strong> {new Date(job.lastDateToApply).toLocaleDateString()}</p>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center">
              <Link to={`/jobs/${job._id}`} className="bg-[#f02e65] text-white py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2 text-center">
                View Details
              </Link>
              {(userType === 'admin' || userType === 'faculty' || userType === 'alumni') && (
                <>
                  <Link to={`/jobs/edit/${job._id}`} className="bg-gray-100 text-gray-700 py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2 text-center">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded text-center"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListPage;
