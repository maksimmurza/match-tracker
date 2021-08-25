import React from 'react';
import { Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const QuantityInput = ({ value, onChange }) => {
	return (
		<Input
			value={value}
			onChange={e => {
				onChange(parseInt(e.target.value));
			}}
			type="number"
			title="Number of upcoming matches with selected teams"
			icon="filter"
			iconPosition="left"
			style={{ width: '7rem' }}
			data-testid="quantity-input"
		/>
	);
};

QuantityInput.propTypes = {
	value: PropTypes.number,
	onChange: PropTypes.func,
};

export default QuantityInput;
