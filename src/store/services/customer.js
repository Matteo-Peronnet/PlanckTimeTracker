
export function getCustomers() {
    return {
        url: `http://127.0.0.1:8000/app_dev.php/api/time/tracker/customers`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            Authorization: null,
        },
    }
}
