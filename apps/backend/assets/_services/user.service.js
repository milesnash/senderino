import { header } from "../_helpers";
export const userService = {
    login,
    logout,
    register
};

function login(email, password) {
    const user = { email };
    const requestOptions = {
        method: 'POST',
        headers: header(),
        body: JSON.stringify({ email, password })
    };

    return fetch(`/login`, requestOptions)
        .then(handleResponse)
        .then(() => {
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    if (!localStorage.getItem("user")) {
        return;
    }

    localStorage.removeItem("user");

    const requestOptions = {
        method: "POST",
        headers: header(),
    };

    return fetch(`/logout`, requestOptions);
}

function register(user) {
    const requestOptions = {
        method: "POST",
        headers: header(),
        body: JSON.stringify(user),
    };

    return fetch(`/api/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload();
            }

            const error = (data && data.detail) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}