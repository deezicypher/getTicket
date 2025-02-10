import axios from 'axios'

const instance = axios.create({
    //baseURL: "http://localhost:8000",
    withCredentials: true, 
});


export const postAPI = async (url:string, post?:object) => {
  const res = await instance.post(`/api/${url}`, post)

  return res;
}


export const getAPI = async (url:string) => {
  const res = await instance.get(`/api/${url}`)
  return res;
}

export const patchAPI = async (url:string, post:object) => {
  const res = await instance.patch(`/api/${url}`, post)
  return res;
}


export const putAPI = async (url:string, post:object) => {
  const res = await instance.put(`/api/${url}`, post)

  return res;
}


export const deleteAPI = async (url:string) => {
  const res = await axios.delete(`/api/${url}`)
  return res;
}