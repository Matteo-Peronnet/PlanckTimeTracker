
export const getCustomerById = (state, id) =>
    state.customer.list.find((customer) => customer.id === parseInt(id))

