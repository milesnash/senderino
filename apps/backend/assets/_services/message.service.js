import { header } from "../_helpers";
export const messageService = {
    create,
    getAll,
};

function create(message) {
    const requestOptions = {
        method: "POST",
        headers: header(),
        body: JSON.stringify(message),
    };
    
    return fetch(`/api/messages`, requestOptions)
        .then(handleResponse)
        .then((message) => message);
}

function getAll() {
    const requestOptions = {
        method: "GET",
        headers: header(),
    };
    
    return fetch(`/api/messages`, requestOptions)
        .then(handleResponse);
}

function handleResponse(response) {
    return response.text().then((text) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.detail && data.detail.split(": ")[1]) || response.statusText;
            return Promise.reject(error);
        }
        
        return data;
    });
}
