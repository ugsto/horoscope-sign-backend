import * as dotenv from 'dotenv';

dotenv.config();

export function getEnvironment(key: string): string | undefined;
export function getEnvironment(key: string, defaultValue: string): string;
export function getEnvironment(
	key: string,
	defaultValue?: string,
): string | undefined {
	// eslint-disable-next-line security/detect-object-injection
	return process.env[key] ?? defaultValue;
}

export const isProduction
	= getEnvironment('NODE_ENV', 'development') === 'production';
