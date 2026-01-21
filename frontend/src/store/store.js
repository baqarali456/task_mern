import {configureStore} from "@reduxjs/toolkit"
import {Reducer} from "./slice"

const store = configureStore({
    reducer:Reducer,
})

export {
    store
}