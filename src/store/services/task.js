
export function getProject(id) {
    return {
        url: `/api/project/${id}/tasks`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            Authorization: null
        },
    }
}

export function assignTask(payload) {
    return {
        url: `/api/task/${payload.taskId}/assign`,
        method: 'POST',
        headers: {
            Accept: 'application/ld+json',
            Authorization: null
        },
    }
}
