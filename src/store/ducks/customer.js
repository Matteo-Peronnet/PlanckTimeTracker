import { ajax } from 'rxjs/ajax'
import _ from 'lodash'
import { getCustomer, getCustomers } from '../services/customer';
import { map, catchError } from 'rxjs/operators';

const GET_CUSTOMER_REQUEST = 'customer/GET_CUSTOMER_REQUEST';
const GET_CUSTOMER_FAILURE = 'customer/GET_CUSTOMER_FAILURE';
const GET_CUSTOMER_SUCCESS = 'customer/GET_CUSTOMER_SUCCESS';

const GET_CUSTOMERS_REQUEST = 'customer/GET_CUSTOMERS_REQUEST';
const GET_CUSTOMERS_FAILURE = 'customer/GET_CUSTOMERS_FAILURE';
const GET_CUSTOMERS_SUCCESS = 'customer/GET_CUSTOMERS_SUCCESS';

// Initial state
const INITIAL_STATE = {
    list: []
}

// Reducer
export function reducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case GET_CUSTOMER_SUCCESS:
            return {
                ...state,
                list: _.unionWith(
                    [action.result],
                    state.list,
                    (l, r) => l.id === r.id
                )
            }
        case GET_CUSTOMERS_SUCCESS:
            return {
                ...state,
                list: action.result
            }
        default:
            return state
    }
}


export function getCustomersRequest() {
    return {
        types: [GET_CUSTOMERS_REQUEST, GET_CUSTOMERS_SUCCESS, GET_CUSTOMERS_FAILURE],
        promise: (getState) => ajax(getCustomers()).pipe(
            map((res) => res.response),
            catchError((error) => Promise.reject(error)),
        ).toPromise()
    }
}

export function getCustomerRequest(id) {
    return {
        types: [GET_CUSTOMER_REQUEST, GET_CUSTOMER_SUCCESS, GET_CUSTOMER_FAILURE],
        promise: (getState) => ajax(getCustomer(id)).pipe(
            map((res) => res.response),
            catchError((error) => Promise.reject(error)),
        ).toPromise()
    }
}
