import {type Response, type Request, type NextFunction} from 'express';
import {type ZodSchema} from 'zod';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export function validateRequestMiddlewareGenerator<T extends ZodSchema>(
	schema: T,
) {
	return async (request: Request, response: Response, next: NextFunction) => {
		try {
			const {body, query, params} = request;

			const parsed = schema.parse({
				body,
				query,
				params,
			});

			request.body = parsed.body;
			request.query = parsed.query;
			request.params = parsed.params;

			next();
		} catch (error) {
			response.status(400).send({error: (error as Error).message});
		}
	};
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
