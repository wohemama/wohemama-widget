import axios from 'redaxios'
export const wohemamaApi = axios.create({ baseURL: 'https://wohemama.com' })
export const amapApi = axios.create({ baseURL: 'https://restapi.amap.com' })
export const redirectPayReturnHost="https://wohemama.com"