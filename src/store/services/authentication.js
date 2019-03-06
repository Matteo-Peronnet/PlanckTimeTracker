

export function login(token) {
    return {
        url: `http://planck.troopers.test/app_dev.php/api/timeTracker/token/check`,
        method: 'GET',
        headers: {
            'X-TIME-TRACKER-TOKEN': token
        },
    }
}
