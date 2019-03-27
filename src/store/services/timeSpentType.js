
export function getTimeSpentType(token) {
    return {
        url: `/api/time_spent_types`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            Authorization: null
        },
    }
}
