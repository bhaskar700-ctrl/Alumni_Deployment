// controllers/privacySettingsController.js
import User from '../models/User.js';

// Fetch privacy settings
export const getPrivacySettings = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('privacySettings');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Initialize privacy settings if they are missing
    const defaultPrivacySettings = {
      showEmail: true,
      showPhone: false,
      showWorkExperience: true,
      showEducationHistory: true
    };

    const privacySettings = {
      ...defaultPrivacySettings,
      ...user.privacySettings
    };

    res.json(privacySettings);
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update privacy settings
export const updatePrivacySettings = async (req, res) => {
    const { userId } = req.params;
    const settings = req.body;
  
    try {
      console.log('Request Body:', settings); // Debug log for request body
  
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ error: 'User not found' });
      }
  
      console.log('Existing Privacy Settings:', user.privacySettings); // Debug log for existing settings
  
      // Update privacy settings
      user.privacySettings = {
        ...user.privacySettings.toObject(), // Ensure it's a plain object
        ...settings
      };
  
      await user.save();
      console.log('Updated Privacy Settings:', user.privacySettings); // Debug log for updated settings
  
      res.json(user.privacySettings);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };