const API_BASE_URL = 'http://your-backend-api.com/api'; // Change this to your actual API base URL

/**
 * Create a new forum post.
 * @param {Object} postData The data for the new post.
 * @returns {Promise} A promise that resolves with the newly created post data.
 */
export const createPost = async (postData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as required, for example, authorization headers
        //'Authorization': `Bearer ${yourAuthToken}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      // If the server response was not OK, throw an error with the response status
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // This should include the newly created post
  } catch (error) {
    console.error("Error creating post:", error);
    // Rethrow the error to be caught by the calling function
    throw error;
  }
};
