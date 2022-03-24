import axios from 'axios'

const request=axios.create({
    baseURL:"http://localhost:3030"
})

export const getData=()=>request.get('/api/list').then(res=>res.data)