import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/comment"
const token = localStorage.getItem(constants.REFRESH_TOKEN);

// api: Lấy danh sách comment
const getCommentList = (id) => {
    return axios.get(endpoint + "/read", {
        params: {
            id: id
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// api: Thêm 1 comment
const postComment = (cmt) => {
    return axios.post(endpoint + "/create", cmt, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export {
    getCommentList,
    postComment
}