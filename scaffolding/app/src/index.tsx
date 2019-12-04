import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Typography, Button } from '@brewkit/components/src/components';


const render: any = () => {

    const rootElement = document.getElementById('root');

    if (rootElement) {
        ReactDOM.render(
            <HashRouter>
                <Typography>Hello world!</Typography>
                <Button>Foo</Button>
            </HashRouter>,
        rootElement,
        );
    }

};

render();
