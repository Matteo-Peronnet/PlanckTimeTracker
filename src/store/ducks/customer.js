import { ajax } from 'rxjs/ajax'
import { getCustomers } from '../services/customer';
import { map, catchError } from 'rxjs/operators';


const GET_CUSTOMER_REQUEST = 'customer/GET_CUSTOMER_REQUEST';
const GET_CUSTOMER_FAILURE = 'customer/GET_CUSTOMER_FAILURE';
const GET_CUSTOMER_SUCCESS = 'customer/GET_CUSTOMER_SUCCESS';

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
                list: action.result
            }
        default:
            return state
    }
}


export function getCustomersRequest() {
    return {
        types: [GET_CUSTOMER_REQUEST, GET_CUSTOMER_SUCCESS, GET_CUSTOMER_FAILURE],
        promise: (getState) => ajax(getCustomers()).pipe(
            map((res) => res.response),
            catchError((error) => Promise.reject(error)),
        ).toPromise()
    }
}