import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: error };
	}

	componentDidCatch(error, errorInfo) {
		console.log('Error in local error boundary');
		console.log(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <div title="Possibly because of too much requets per minute">:(</div>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
