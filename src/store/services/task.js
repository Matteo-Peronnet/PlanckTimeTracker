import env from '../../../env.json'

export function getProject(token, id) {
    return {
        url: `${env.PLANCK_HOST}/api/timeTracker/project/${id}`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            'X-TIME-TRACKER-TOKEN': token
        },
    }
}

export function assignTask(token, payload) {
    return {
        url: `${env.PLANCK_HOST}/api/timeTracker/task/${payload.taskId}/assign`,
        method: 'POST',
        headers: {
            Accept: 'application/ld+json',
            'X-TIME-TRACKER-TOKEN': token
        },
    }
}
