
export function getProject(token, id) {
    return {
        url: `http://planck.troopers.test/app_dev.php/api/timeTracker/project/${id}`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            'X-TIME-TRACKER-TOKEN': token
        },
    }
}

export function assignTask(token, payload) {
    return {
        url: `http://planck.troopers.test/app_dev.php/api/timeTracker/task/${payload.taskId}/assign`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            'X-TIME-TRACKER-TOKEN': token
        },
    }
}
