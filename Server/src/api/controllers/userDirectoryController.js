import User from '../models/User.js';

const fetchDistinctDepartments = async () => {
  return await User.distinct('educationHistory.department');
};

const fetchDistinctYears = async () => {
  return await User.distinct('educationHistory.yearOfGraduation');
};

export const fetchUsers = async (req, res) => {
  const { userType, department, programme, sortBy, page, limit, searchQuery } = req.query;

  try {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 100;
    const skip = (pageNumber - 1) * limitNumber;

    let query = User.find();

    // Apply filters
    if (userType) query = query.where('userType').equals(userType);
    if (department) query = query.where('educationHistory.department').equals(department);
    if (programme) query = query.where('educationHistory.programme').equals(programme);
    if (searchQuery) {
      query = query.where({
        $or: [
          { 'personalDetails.firstName': new RegExp(searchQuery, 'i') },
          { 'personalDetails.lastName': new RegExp(searchQuery, 'i') },
          { 'contactInfo.email': new RegExp(searchQuery, 'i') }
        ]
      });
    }

    // Apply sorting
    if (sortBy) query = query.sort(sortBy);

    // Apply pagination
    const users = await query.skip(skip).limit(limitNumber).lean().exec();
    const totalUsers = await User.countDocuments(query.getFilter());

    // Fetch distinct departments and years
    const departments = await fetchDistinctDepartments();
    const years = await fetchDistinctYears();

    res.json({ users, totalUsers, departments, years });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Fetch user by ID
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const filteredUser = user.filterUserByPrivacySettings();
    res.json(filteredUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Mark user as favorite
export const markFavorite = async (req, res) => {
  const { userId } = req.params;
  const { favoriteUserId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.favorites.includes(favoriteUserId)) {
      user.favorites.push(favoriteUserId);
      await user.save();
    }

    res.json({ message: 'User marked as favorite' });
  } catch (error) {
    console.error('Error marking user as favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Set user online status
export const setUserOnlineStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.onlineStatus = status;
    await user.save();

    res.json({ message: 'User online status updated' });
  } catch (error) {
    console.error('Error updating user online status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch user activity feed
export const getUserActivityFeed = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const activityFeed = await getUserActivity(userId); // Assume getUserActivity is a function to fetch activity feed
    res.json(activityFeed);
  } catch (error) {
    console.error('Error fetching user activity feed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch user badges and tags
export const getUserBadges = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.badges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch user profile completion status
export const getProfileCompletion = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const completionPercentage = calculateProfileCompletion(user); // Assume calculateProfileCompletion is a function to calculate profile completion
    res.json({ completionPercentage });
  } catch (error) {
    console.error('Error fetching profile completion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper functions for calculating profile completion, fetching activity feed, etc.

const calculateProfileCompletion = (user) => {
  let completion = 0;
  const totalFields = 10; // Example: total number of fields considered for completion
  let filledFields = 0;

  if (user.personalDetails.firstName) filledFields++;
  if (user.personalDetails.lastName) filledFields++;
  if (user.contactInfo.email) filledFields++;
  if (user.contactInfo.phone) filledFields++;
  if (user.contactInfo.address) filledFields++;
  if (user.educationHistory.length > 0) filledFields++;
  if (user.workExperience.length > 0) filledFields++;
  if (user.profilePicture) filledFields++;
  if (user.badges.length > 0) filledFields++;
  if (user.friends.length > 0) filledFields++;

  completion = (filledFields / totalFields) * 100;
  return completion;
};

const getUserActivity = async (userId) => {
  // Mock implementation. Replace with actual logic to fetch user activity feed.
  return [
    { type: 'post', content: 'Posted a new article.', date: new Date() },
    { type: 'comment', content: 'Commented on a discussion.', date: new Date() }
  ];
};
