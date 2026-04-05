import axios from 'axios';
import { toast } from 'react-toastify';
import { socket } from 'socket';

export const saveToken = user_data => {
  const settings = {
    ...user_data,
  };
  setAuthToken(user_data?.token);
  localStorage.setItem(
    'UserPreferences',
    window.btoa(JSON.stringify(settings)),
  );
};
export const setAuthToken = access_Token => {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ` + access_Token;
  } catch (e) {
    toast.error('Error while setup token');
  }
};

export const getAuthToken = () => {
  let userPreferences = localStorage.getItem('UserPreferences');
  if (userPreferences) {
    try {
      const decodedPreferences = JSON.parse(window?.atob(userPreferences));
      return decodedPreferences;
    } catch (error) {
      toast.error('Error parsing user preferences');
    }
  }
};

export const clearToken = () => {
  localStorage.removeItem('UserPreferences');
  localStorage.removeItem('userLocation');
  clearAuthToken();
};

const clearAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};

export const saveCompanyForForgot = user_data => {
  localStorage.setItem(
    'companyForForgot',
    window.btoa(JSON.stringify(user_data)),
  );
};

export const getCompanyForForgot = () => {
  let companyForForgot = localStorage.getItem('companyForForgot');
  if (companyForForgot) {
    try {
      const decodedForgotEmail = JSON.parse(window?.atob(companyForForgot));
      return decodedForgotEmail;
    } catch (error) {
      toast.error('Error parsing forgot email');
    }
  }
};

export const clearCompanyForforgot = () => {
  localStorage.removeItem('companyForForgot');
};

export const socketDataSend = userId => {
  const sendData = {
    en: 'JU',
    data: {
      user_id: userId,
    },
  };

  const sendMessage = {
    en: 'MESSAGE_COUNT',
    data: {
      user_id: userId,
    },
  };

  socket.emit('req', sendData);
  socket.emit('req', sendMessage);
};
