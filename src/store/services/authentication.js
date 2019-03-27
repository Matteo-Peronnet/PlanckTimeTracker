import env from '../../../env.json'

export function login(payload) {
    console.log(payload)
    let data = {
        username: payload.email,
        password: payload.password
    }

    return {
        method: 'POST',
        url: `${env.PLANCK_HOST}/api/login_check`,
        headers: {
            'Content-Type': "application/json"
        },
        body: data,
    }
}

export function loginCheck(refreshToken) {
    console.log(refreshToken)

    let data = {
        refresh_token: refreshToken
    }

    return {
        method: 'POST',
        url: `${env.PLANCK_HOST}/api/token/refresh`,
        headers: {
            'Content-Type': "application/json"
        },
        body: data,
    }
}


export function getAccount(token) {

    return {
        url: `${env.PLANCK_HOST}/api/users/me`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            Authorization: `Bearer ${token}`
        },
    }
}
