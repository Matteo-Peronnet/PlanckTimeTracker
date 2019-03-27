
export function getCustomers() {
    return {
        url: `/api/customers?withProject=true`,
        method: 'GET',
        headers: {
            Accept: 'application/ld+json',
            Authorization: null
        },
    }
}
