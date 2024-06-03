import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../../redux/store/jobSlice';
import { Link } from 'react-router-dom';

const JobBoard = () => {
  const dispatch = useDispatch();
  const { jobs, status, error } = useSelector((state) => state.jobs);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  if (status === 'loading') return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-5">Error: {error}</div>;

  // Assuming jobs are sorted by date in descending order (latest first)
  const latestJob = jobs.length > 0 ? jobs[0] : null;

  return (
    <div className=''>

      <h2 className="text-xl text-center font-bold text-cyan-50">Latest Job Listing</h2>
      {latestJob ? (
        <div className="py-3 flex justify-center">
          <div className="bg-white p-4 rounded shadow-md w-fit">
            <div style={{ height: "200px", width: "300px" }}>
              <img
                className="w-full h-full object-cover rounded"
                alt="job"
                src="https://img.freepik.com/premium-psd/we-are-hiring-job-vacancy-social-media-post-template_504779-82.jpg"
              />
            </div>
            <h1 className="text-2xl font-medium mt-2">{latestJob.title}</h1>
            <p className="text-gray-600 text-sm mt-1">{latestJob.description}</p>
            <div className="mt-4">
              <Link to={`/jobs/${latestJob._id}`} className="bg-[#f02e65] text-white py-2 px-4 rounded mr-2">
                View Details
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div>No jobs available</div>
      )}
    </div>
  );
};

export default JobBoard;
