import { z } from 'zod';

const DECIMAL_STRING_REGEX = /^-?[0-9]+(?:\.?[0-9]+)?$/;

export const decimalString = () =>
	z
		.string()
		.regex(DECIMAL_STRING_REGEX, { message: 'Invalid decimal string' });
