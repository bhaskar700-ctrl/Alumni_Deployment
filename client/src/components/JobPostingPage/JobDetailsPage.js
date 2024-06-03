import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById } from '../../redux/store/jobSlice';

const JobDetailsPage = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const dispatch = useDispatch();
    const job = useSelector((state) => state.jobs.currentJob);
    const { status, error } = useSelector((state) => state.jobs);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        if (jobId) {
            dispatch(fetchJobById(jobId));
        }
    }, [dispatch, jobId]);

    const handleGoBack = () => {
        navigate(-1);
    }

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!job) {
        return <div>No job found</div>;
    }

    const jobImageUrl = job.image ? `${apiUrl}${job.image}` : 'https://i.ibb.co/SKLJ7WX/austin-distel-jp-Hw8ndw-J-Q-unsplash-1.png';

    return (
        <div className="xl:mx-auto xl:container border-2 xl:px-20 md:px-6 px-4 py-12">
            <button onClick={handleGoBack} className="absolute top-4 right-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
            </button>
            <div className="flex flex-col lg:flex-row justify-between lg:space-x-12 2xl:space-x-6">
                <div className="w-full lg:w-3/5 xl:w-3/5 order-2 lg:order-1">
                    <h2 className="lg:text-4xl text-3xl font-extrabold leading-9 text-gray-800 ">Job Details</h2>
                    <div className="mt-6 lg:w-full">
                        <div className="job-details">
                            <h2 className="mb-4">{job.title}</h2>
                            <p className="mb-2"><strong>Description:</strong> {job.description}</p>
                            <p className="mb-2"><strong>Company:</strong> {job.company}</p>
                            <p className="mb-2"><strong>Location:</strong> {job.location}</p>
                            <p className="mb-2"><strong>Type:</strong> {job.type}</p>
                            <p className="mb-2"><strong>Last Date to Apply:</strong> {new Date(job.lastDateToApply).toLocaleDateString()}</p>
                            {job.applyLink && (
                                <p className="mb-2"><strong>How to Apply:</strong> <a href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply Here</a></p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-2/5 xl:w-2/5 order-1 lg:order-2 mb-6 lg:mb-0">
                    <img src={jobImageUrl} alt="job" className="w-full object-cover object-center object-fill h-full" />
                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;
