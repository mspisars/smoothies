import axios from "axios";

export function apiHeaders() {
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  // return authorization header if token exists
  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}` ;
  }
  return headers;
}

export const axiosHelper = async (options) => {
  try {
    const res = await axios({
      ...options, 
      headers: apiHeaders()
    });

    if (res.status === 401) {
      console.log(res);
    }
    return res;
  } catch(e) {
    console.log(e);
  }
};
