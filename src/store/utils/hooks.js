import env from '../../../env.json'

const hooks = {
    before: (request, state) => {
        if (request.url.match(/^\/api/)) {
            request.url = `${env.PLANCK_HOST}${request.url}`
        }

        if (request.headers.Authorization === null) {
            request.headers.Authorization = `Bearer ${state.user.token}`
        }
    },
}

export default hooks
