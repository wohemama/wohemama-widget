import axios from 'redaxios'
export const wohemamaApi = axios.create({ baseURL: 'http://localhost:3001' })
export const amapApi = axios.create({ baseURL: 'https://restapi.amap.com' })