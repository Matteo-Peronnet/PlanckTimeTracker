
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
        url: `/api/timeSpent/${projectId}/${taskId}/new`,
        method: 'POST',
        headers: {
            Accept: 'application/ld+json',
            Authorization: null
        },
        body: JSON.stringify(data)
    }
}
