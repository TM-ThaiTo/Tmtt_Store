import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { persistReducer } from 'redux-persist';
import appReducer from "./appReducer";
import userReducer from "./userReducer";
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

const appPersistConfig = {
    ...persistCommonConfig,
    key: 'app',
    whitelist: ['language']
}

const authPersistConfig = {
    ...persistCommonConfig,
    key: 'auth',
    whitelist: ['isAuth']
}
const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    app: persistReducer(appPersistConfig, appReducer),
    authenticate: persistReducer(authPersistConfig, authReducer),
    cart: cartReducer,
    user: userReducer,
    // user: persistReducer(userPersistConfig, userReducer),
});

export default rootReducer;
