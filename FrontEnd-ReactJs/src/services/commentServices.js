import axios from '../axios';

// api: Lấy danh sách comment
const getCommentList = (id) => {
    return axios.get(`/apis/comment?id=${id}`);
}

// api: Thêm 1 comment
const postComment = (cmt) => {
    return axios.post("/apis/comment", cmt);
}

export {
    getCommentList,
    postComment
}