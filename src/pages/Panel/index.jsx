import React from 'react';
import { render } from 'react-dom';

import Panel from './Panel';
import './index.css';
import { ContextFactory } from "../../utils/ContextFactory";

let factory = new ContextFactory();
factory.getExtensionContext().then(ctx => {
    render(<Panel context={ctx} />, window.document.querySelector('#app-container'));
})
//@ts-ignore
if (module.hot) module.hot.accept();
