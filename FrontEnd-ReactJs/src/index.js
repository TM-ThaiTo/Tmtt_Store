import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import reduxStore, { persistor } from './redux';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            <App persistor={persistor} />
        </Provider>,
        document.getElementById('root')
    );
};
renderApp();
serviceWorker.unregister();
