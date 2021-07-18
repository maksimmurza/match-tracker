import React from 'react';
import { Input } from 'semantic-ui-react';

const QuantityInput = ({ value, onChange }) => {
	return (
		<Input
			value={value}
			onChange={onChange}
			type="number"
			title="Number of upcoming matches with selected teams"
			icon="filter"
			iconPosition="left"
			style={{ width: '7rem' }}
		/>
	);
};

export default QuantityInput;
