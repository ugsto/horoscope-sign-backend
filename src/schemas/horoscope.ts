import {z} from 'zod';

/* eslint-disable @typescript-eslint/naming-convention */
export const HoroscopeSchema = z.object({
	colorHex: z.string().regex(/^#([\dA-Fa-f]{6}|[\dA-Fa-f]{3})$/),
	colorName: z.string().min(1),
	number: z.number().int().min(1).max(16),
	event: z.string().min(1),
});
