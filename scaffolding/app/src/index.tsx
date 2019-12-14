import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import Main from './scenes/main';


const render: any = () => {

    const rootElement = document.getElementById('root');

    if (rootElement) {
        ReactDOM.render(
            <HashRouter>
                <Main />
            </HashRouter>,
        rootElement,
        );
    }

};

render();
