
export function getCustomers() {
    return {
        url: `http://127.0.0.1:8000/app_dev.php/api/timeTracker/customers`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            Authorization: null,
        },
    }
}

export function getCustomer(id) {
    return {
        url: `http://127.0.0.1:8000/app_dev.php/api/timeTracker/customer/${id}`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            Authorization: null,
        },
    }
}
