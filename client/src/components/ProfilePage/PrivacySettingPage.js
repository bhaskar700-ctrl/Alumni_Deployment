import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPrivacySettings, updatePrivacySettings, resetStatus } from '../../redux/store/privacySettingSlice';

const PrivacySettingsPage = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { settings, status, error } = useSelector((state) => state.privacySettings);
  const [localSettings, setLocalSettings] = useState({
    showEmail: true,
    showPhone: false,
    showWorkExperience: true,
    showEducationHistory: true,
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchPrivacySettings(userId));
    }

    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePrivacySettings({ userId, settings: localSettings }));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Edit Privacy Settings</h2>
        {status === 'loading' && <div>Loading...</div>}
        {status === 'succeeded' && <div className="text-green-500 mb-4">Settings updated successfully!</div>}
        {status === 'failed' && <div className="text-red-500 mb-4">Error: {error}</div>}
        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="checkbox"
              name="showEmail"
              checked={localSettings.showEmail}
              onChange={handleChange}
              className="mr-2"
            />
            Show Email
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="checkbox"
              name="showPhone"
              checked={localSettings.showPhone}
              onChange={handleChange}
              className="mr-2"
            />
            Show Phone
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="checkbox"
              name="showWorkExperience"
              checked={localSettings.showWorkExperience}
              onChange={handleChange}
              className="mr-2"
            />
            Show Work Experience
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="checkbox"
              name="showEducationHistory"
              checked={localSettings.showEducationHistory}
              onChange={handleChange}
              className="mr-2"
            />
            Show Education History
          </label>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default PrivacySettingsPage;
