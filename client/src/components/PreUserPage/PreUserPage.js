import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAdmins,
  fetchAlumni,
  fetchFaculty,
  fetchStudents,
  fetchDistinctDepartments,
  fetchDistinctYears,
} from "../../redux/store/preUserSlice";
import AdminList from "./AdminList";
import AlumniList from "./AlumniList";
import FacultyList from "./FacultyList";
import StudentList from "./StudentList";

const PreUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, admins, alumni, faculty, students, departments, years } = useSelector(
    (state) => state.preUser
  );
  const [selectedType, setSelectedType] = useState("admins");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(fetchAdmins());
    dispatch(fetchAlumni());
    dispatch(fetchFaculty());
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    if (selectedType === "admins" || selectedType === "faculty") {
      dispatch(fetchDistinctDepartments(selectedType));
    } else {
      dispatch(fetchDistinctYears(selectedType));
    }
  }, [dispatch, selectedType]);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setFilter("");
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleNewEntry = () => {
    navigate(`/create-${selectedType}`);
  };

  const filteredData = () => {
    let data;
    switch (selectedType) {
      case "admins":
        data = admins;
        break;
      case "alumni":
        data = alumni;
        break;
      case "faculty":
        data = faculty;
        break;
      case "students":
        data = students;
        break;
      default:
        data = [];
    }

    if (filter) {
      switch (selectedType) {
        case "admins":
        case "faculty":
          data = data.filter((item) => item.department === filter);
          break;
        case "alumni":
          data = data.filter(
            (item) => item.graduationYear === parseInt(filter)
          );
          break;
        case "students":
          data = data.filter(
            (item) => item.enrollmentYear === parseInt(filter)
          );
          break;
        default:
          break;
      }
    }

    return data;
  };

  if (status === "loading") return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="border-2 rounded-lg flex justify-center w-full h-full bg-stone-400">
      <div className="border-2 w-4/5 bg-white my-4 rounded-lg shadow-lg border-gray-500">
        <h1 className="text-center text-2xl font-bold mb-6">PreUser Management</h1>
        <div className="mt-4 mx-4 mb-6">
          <label className="block mb-4">
            <span className="text-gray-700">Select Type:</span>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="admins">Admins</option>
              <option value="alumni">Alumni</option>
              <option value="faculty">Faculty</option>
              <option value="students">Students</option>
            </select>
          </label>
          {selectedType === "admins" || selectedType === "faculty" ? (
            <label className="block mb-4">
              <span className="text-gray-700">Filter by Department:</span>
              <select
                value={filter}
                onChange={handleFilterChange}
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">All</option>
                {departments.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="block mb-4">
              <span className="text-gray-700">
                Filter by {selectedType === "alumni" ? "Graduation Year" : "Enrollment Year"}:
              </span>
              <select
                value={filter}
                onChange={handleFilterChange}
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">All</option>
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleNewEntry}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New {selectedType.slice(0)}
            </button>
          </div>
          <div className="border-t-2 mt-2">
            {selectedType === "admins" && <AdminList filter={filter} />}
            {selectedType === "alumni" && <AlumniList filter={filter} />}
            {selectedType === "faculty" && <FacultyList filter={filter} />}
            {selectedType === "students" && <StudentList filter={filter} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreUserPage;
