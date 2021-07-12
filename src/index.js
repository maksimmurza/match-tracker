import React from 'react';
import ReactDOM from 'react-dom';
import DataProvider from './components/DataProvider/DataProvider';
import App from './components/App';
import 'semantic-ui-css/semantic.min.css';
import GlobalErrorBoundary from './components/ErrorBoundaries/GlobalErrorBoundary';

Date.prototype.addHours = function (hours) {
	this.setTime(this.getTime() + hours * 60 * 60 * 1000);
	return this;
};

ReactDOM.render(
	<React.StrictMode>
		<GlobalErrorBoundary>
			<DataProvider render={leagues => <App leagues={leagues}></App>} />
		</GlobalErrorBoundary>
	</React.StrictMode>,
	document.getElementById('root')
);
