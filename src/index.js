import React from 'react';
import ReactDOM from 'react-dom';
import Schedule from './components/Schedule/Schedule';
import 'semantic-ui-css/semantic.min.css';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';

ReactDOM.render(
	<React.StrictMode>
		<GlobalErrorBoundary>
			<Schedule />
		</GlobalErrorBoundary>
	</React.StrictMode>,
	document.getElementById('root')
);
