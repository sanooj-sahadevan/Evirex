/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const commonAPI = async (method: string, url: string, body?: any, headers?: Record<string, string>) => {
  try {
    console.log('axiosss');
    
    const response = await axios.request({
      url,
      method,
      data: body,
      headers: headers ? { ...headers } : {},
    });
    console.log('axx sucess');
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
