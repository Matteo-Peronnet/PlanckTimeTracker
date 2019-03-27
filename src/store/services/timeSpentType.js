import env from '../../../env.json';

export function getTimeSpentType(token) {
    return {
        url: `${env.PLANCK_HOST}/api/timeTracker/timeSpentTypes`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            'X-TIME-TRACKER-TOKEN': token
        },
    }
}
