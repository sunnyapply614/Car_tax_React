

import rootReducer from "../reducers";

const persistConfig = {
    key: 'root',
    storage: storage,
}
const initalState = {};
const middleware = [thunk];
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
    persistedReducer,
    initalState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
