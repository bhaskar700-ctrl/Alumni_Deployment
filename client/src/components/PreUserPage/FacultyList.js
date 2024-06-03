import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFaculty, updateFaculty, deleteFaculty } from '../../redux/store/preUserSlice';
import UserForm from './UserForm';

const FacultyList = ({ filter }) => {
  const dispatch = useDispatch();
  const faculty = useSelector((state) => state.preUser.faculty);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = (faculty) => {
    dispatch(createFaculty(faculty));
  };

  const handleEdit = (faculty) => {
    dispatch(updateFaculty({ id: faculty._id, faculty }));
    setEditingFaculty(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteFaculty(id));
  };

  const closeModal = () => {
    setEditingFaculty(null);
  };

  const filteredFaculty = faculty.filter((facultyMember) => {
    return (
      (!filter || facultyMember.department === filter) &&
      (!searchTerm || facultyMember.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Faculty List</h1>
      <label className="block mb-4">
        <span className="text-gray-700">Search:</span>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </label>
      <ul className="space-y-4">
        {filteredFaculty.map((facultyMember) => (
          <li key={facultyMember._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">{facultyMember.name}</p>
              <p className="text-gray-600">{facultyMember.email}</p>
              <p className="text-gray-600">{facultyMember.department}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setEditingFaculty(facultyMember)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(facultyMember._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editingFaculty && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="w-1/3 p-1 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 mt-4 mr-4 bg-white rounded-lg border-2 text-red-600 hover:text-gray-900 text-3xl font-bold"
            >
              &times;
            </button>
            <UserForm user={editingFaculty} onSave={handleEdit} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyList;
