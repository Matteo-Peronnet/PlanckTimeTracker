import env from '../../../env.json'

export function getCustomers(token) {
    return {
        url: `${env.PLANCK_HOST}/api/timeTracker/customers`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            'X-TIME-TRACKER-TOKEN': token
        },
    }
}
