import axios from 'axios';
axios.defaults.withCredentials = true

//const url = process.env.APIURL
const url = "http://tweety-backend.herokuapp.com"

//AUTH
export const checkedIfLoggedIn = async () => {
    try {
        const response = await axios.get(url + '/auth/checkifloggedin')
        console.log(response)
        return response
    } catch (err) {
        console.log(err.response)
        return err.response
    }
}

export const logIn = async (formData) => {
    try {
        const response = await axios.post(url +'/auth/login', formData)
        console.log(response)
        return response
    } catch (err) {
        console.log(err.response)
        return err.response
    }
}

export const signUp = async (formData) => {
    try {
        const response = await axios.post(url +'/auth/signUp', formData)
        console.log(response)
        return response
    } catch (err) {
        console.log(err.response)
        return err.response
    }
}

export const logOut = async () => {
    try {
        const response = await axios.post(url +'/auth/logout')
        console.log(response)
        return response
    } catch (err) {
        console.log(err.response)
        return err.response
    }
}


//POST

export const myFeed = async(page) => {
    try {
        const response = await axios.get(url + `/feed/${page}`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

export const createPost = async(formData) => {
    try {
        const response = await axios.post(url + '/post', formData)
        console.log(response)
        console.log(response.data)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

export const toggleLike = async (id) => {
    try {
        const response = await axios.put(url + `/post/${id}/like`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

export const getUserPosts = async (link) => {
    try {
        const response = await axios.get(url + `/user/${link}/posts`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

export const getPost = async (id) => {
    try {
        const response = await axios.get(url + `/post/${id}`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

export const getParentReplies = async (id) => {
    try {
        const response = await axios.get(url + `/post/${id}/parentreplies`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

export const getUserReplies = async (link) => {
    try {
        const response = await axios.get(url + `/user/${link}/replies`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

export const deletePost = async (id) => {
    try {
        const response = await axios.delete(url + `/post/${id}`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

//USER

export const getUser = async (link) => {

    try {
        const response = await axios.get(url + `/user/${link}`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }

}

export const toggleFollow = async (link) => {

    try {
        const response = await axios.put(url + `/user/${link}/follow`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }

}

export const searchUser = async (link) => {

    try {
        const response = await axios.get(url + `/user/${link}/search`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }

}

export const editProfile = async (formData) => {

    try {
        const response = await axios.put(url + `/user/update`, formData)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

export const getFollowers = async (link) => {

    try {
        const response = await axios.get(url + `/user/${link}/followers`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}

export const getFollows = async (link) => {

    try {
        const response = await axios.get(url + `/user/${link}/follows`)
        console.log(response)
        return response
    } catch (err){
        console.log(err.response)
        return err.response
    }
}
