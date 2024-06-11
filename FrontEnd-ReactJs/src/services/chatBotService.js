import axios from "axios";

const OPEN_AI_ENDPOINT = 'https://api.openai.com/v1'
const chatGPTKey = 'sk-proj-PCuIkJJH6UocNFnj0JBET3BlbkFJi7rcMBE7CNQCuOBjTRX3';

// api: chatBot with OpenAi
const postChatGPT = (messages) => {
    return axios.post(
        `${OPEN_AI_ENDPOINT}/completions`, {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.9,
        max_tokens: 4000,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${chatGPTKey}`,
        },
    }
    );
}

// api: chatBot vs python
const chatPy = "http://localhost:4444";
const postChatPy = (message) => {
    const data = {
        message: message
    }
    return axios.post(`${chatPy}/chat`, data);
}

export {
    postChatGPT,
    postChatPy
}