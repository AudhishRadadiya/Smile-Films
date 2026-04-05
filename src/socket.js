import { REACT_APP_GLOBAL_URL } from 'Helper/Environment';
import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === 'production' ? undefined : REACT_APP_GLOBAL_URL;

export const socket = io(URL);
