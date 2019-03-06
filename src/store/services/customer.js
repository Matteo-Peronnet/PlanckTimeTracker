
export function getCustomers(token) {
    return {
        url: `http://planck.troopers.test/app_dev.php/api/timeTracker/customers`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            'X-TIME-TRACKER-TOKEN': token
        },
    }
}
