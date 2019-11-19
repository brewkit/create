import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';


const render: any = () => {

    const rootElement = document.getElementById('root');

    if (rootElement) {
        ReactDOM.render(
            <HashRouter>
                <div>Hello world!</div>
            </HashRouter>,
        rootElement,
        );
    }

};

render();
