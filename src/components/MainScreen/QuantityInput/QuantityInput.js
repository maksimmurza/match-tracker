import React from 'react';
import { Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

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

QuantityInput.propTypes = {
	value: PropTypes.number,
	onChange: PropTypes.func,
};

export default QuantityInput;
