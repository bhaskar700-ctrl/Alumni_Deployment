import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux/store/store'; // Adjust this path if necessary
import { loginSuccess } from './redux/store/authSlice'; // Import the action creator for setting the auth state
import { ToastContainer } from 'react-toastify';

// Attempt to retrieve the token from localStorage
const authToken = localStorage.getItem('authToken');

// If a token is found, update the Redux store's auth state before the app loads
if (authToken) {
  store.dispatch(loginSuccess({ token: authToken }));
}

// Create a root instance
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped with the Provider component to enable Redux store access
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    <ToastContainer/>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
