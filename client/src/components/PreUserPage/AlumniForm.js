import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAlumni } from "../../redux/store/preUserSlice"; // Adjust the path

const AlumniForm = () => {
  const dispatch = useDispatch();
  const [alumniData, setAlumniData] = useState({
    alumniId: "",
    name: "",
    email: "",
    graduationYear: "",
    program: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    nationality: "",
    gender: "",
    coursesCompleted: [{ courseCode: "", courseName: "", grade: "" }],
    gpa: "",
    activities: [],
    isRegistered: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumniData({ ...alumniData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAlumni(alumniData));
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Alumni</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alumniId">
              Alumni ID
            </label>
            <input
              type="text"
              name="alumniId"
              value={alumniData.alumniId}
              onChange={handleChange}
              placeholder="Alumni ID"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={alumniData.name}
              onChange={handleChange}
              placeholder="Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={alumniData.email}
              onChange={handleChange}
              placeholder="Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="graduationYear">
              Graduation Year
            </label>
            <input
              type="number"
              name="graduationYear"
              value={alumniData.graduationYear}
              onChange={handleChange}
              placeholder="Graduation Year"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="program">
              Program
            </label>
            <input
              type="text"
              name="program"
              value={alumniData.program}
              onChange={handleChange}
              placeholder="Program"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={alumniData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={alumniData.address}
              onChange={handleChange}
              placeholder="Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={alumniData.dateOfBirth}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nationality">
              Nationality
            </label>
            <input
              type="text"
              name="nationality"
              value={alumniData.nationality}
              onChange={handleChange}
              placeholder="Nationality"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              name="gender"
              value={alumniData.gender}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gpa">
              GPA
            </label>
            <input
              type="number"
              name="gpa"
              value={alumniData.gpa}
              onChange={handleChange}
              placeholder="GPA"
              min="0"
              max="10"
              step="0.01"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="activities">
              Activities
            </label>
            <input
              type="text"
              name="activities"
              value={alumniData.activities.join(", ")}
              onChange={(e) =>
                setAlumniData({ ...alumniData, activities: e.target.value.split(", ") })
              }
              placeholder="Activities"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlumniForm;
