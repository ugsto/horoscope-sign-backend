import {z} from 'zod';

/* eslint-disable @typescript-eslint/naming-convention */
export const GetSignHoroscopeSchema = z.object({
	params: z.object({
		sign: z.string(),
	}),
	body: z.any(),
	query: z.any(),
});
