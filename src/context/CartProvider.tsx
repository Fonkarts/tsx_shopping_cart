export type CartItemType = {
    sku: string,
    name: string,
    price: number,
    qty: number
}

type CartStateType = {cart: CartItemType[]}

const initCartState: CartStateType = {cart: []}

const REDUCER_ACTION_TYPE = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
    QUANTITY: 'QUANTITY',
    SUBMIT: 'SUBMIT'
}

export type ReducerActionType = typeof REDUCER_ACTION_TYPE

export type ReducerAction = {
    type: string,
    payload?: CartItemType,
}

const reducer = (state: CartStateType, action: ReducerAction): CartStateType => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.ADD: {
            if(!action.payload) {
                throw new Error('action.payload missing in ADD action')
            }
            const {sku, name, price} = action.payload

            // we here select all the products that are NOT the one we update
            // so we can return them along with the updated one, as the new state
            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku !== sku)

            // we here select the product we want to update
            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)

            const qty: number = itemExists ? itemExists.qty +1 : 1

            // we also spread the state variable in order to preserve other data we might have in it
            return { ...state, cart: [...filteredCart, {sku, name, price, qty}] }
        }
        case REDUCER_ACTION_TYPE.REMOVE: {
            if(!action.payload) {
                throw new Error('action.payload missing in REMOVE action')
            }
            const {sku} = action.payload

            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku !== sku)

            return {...state, cart: [...filteredCart]}
        }
        case REDUCER_ACTION_TYPE.QUANTITY: {
            if(!action.payload) {
                throw new Error('action.payload missing in QUANTITY action')
            }
            const {sku, qty} = action.payload

            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)

            if(!itemExists) {
                throw new Error('Item must exist in order to update quantity !')
            }

            const updatedItem: CartItemType = {...itemExists, qty}

            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku !== sku)

            return {...state, cart: [...filteredCart, updatedItem]}
        }
        // since we don't really send data here, we'll just empty the cart
        case REDUCER_ACTION_TYPE.SUBMIT: {
            return {...state, cart: []}
        }
        default:
            throw new Error('Unidentified Reducer Action Type !')
    }
}