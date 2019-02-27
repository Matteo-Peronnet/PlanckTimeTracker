const hooks = {
    before: (request, state) => {
        request.headers.set('Authorization', `Bearer `)
    },
}

export default hooks
