

export function postTimeSpent(token, payload) {

    const { projectId, taskId } = payload.target;
    const { description, timeSpentType, startDate, timeSpentTime} = payload.data;
    const data = {
        'startAt': startDate,
        'type': timeSpentType,
        'time': timeSpentTime,
        'description': description,
    }

    return {
        url: `http://planck.troopers.test/app_dev.php/api/timeTracker/timeSpent/${projectId}/${taskId}/new`,
        method: 'POST',
        headers: {
            Accept: 'application/ld+json',
            'X-TIME-TRACKER-TOKEN': token
        },
        body: JSON.stringify(data)
    }
}
