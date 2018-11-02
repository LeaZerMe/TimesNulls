import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import reducer from './assets/redux/reducer.js';
import Apps from './ApplicatinBody.js';

const store = createStore(reducer);

export default class App extends React.Component {
	render() {
		return (<Provider store={store}>
			<Apps/>
		</Provider>)
	}
}