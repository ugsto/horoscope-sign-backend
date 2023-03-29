import type winston from 'winston';
import {format, createLogger, config, transports} from 'winston';
import {isProduction} from '@/utils/get-environment';
import path from 'node:path';

const projectRoot = path.resolve(path.join(__dirname, '..'));
const projectRootLength = projectRoot.length;

type StackEntry = {
	function: string;
	file: string;
	row: string;
	line: string;
};

function getStackParserRegex() {
	const pathMaxBytes = 4096;
	const sanitizedProjectRoot = projectRoot.replace(
		/[#-.]|[[-^]|[?{|}]/g,
		'\\$&',
	);
	const availablePathBytes = pathMaxBytes - projectRootLength;
	/* eslint-disable security/detect-non-literal-regexp */
	return new RegExp(
		` {4}at (?<function>[^ ]+) \\((?<file>${sanitizedProjectRoot}.{1,${availablePathBytes}}):(?<row>\\d+):(?<column>\\d+)`,
	);
	/* eslint-enable security/detect-non-literal-regexp */
}

function getParentFunctionCall(): StackEntry | undefined {
	const object: {stack?: string} = {};
	Error.stackTraceLimit = 15; // Wiston's stack may vary around 11 entries
	Error.captureStackTrace(object, getParentFunctionCall);
	let {stack} = object;
	if (!stack) {
		return undefined;
	}

	stack = stack.slice(Math.max(0, stack.indexOf('\n') + 1)); // Remove the header "Error:"
	stack = stack.slice(Math.max(0, stack.indexOf('\n') + 1)); // Remove the logger's call
	const parsedStack = getStackParserRegex().exec(stack);
	if (!parsedStack) {
		return undefined;
	}

	const stackFields = parsedStack.groups as unknown as StackEntry;
	stackFields.file = stackFields.file.slice(
		Math.max(0, projectRootLength + 1),
	);
	return stackFields;
}

const {levels} = config.syslog;
const logLevel = isProduction ? 'info' : 'debug';
const customFormat: winston.Logform.Format[] = [
	format.printf(({...arguments_}) => {
		arguments_['time'] = new Date().toISOString();
		arguments_['module'] = getParentFunctionCall();
		/* eslint-enable no-param-reassign */
		return JSON.stringify(arguments_, null, isProduction ? 0 : 2);
	}),
	isProduction ? undefined! : format.colorize({all: true}),
].filter(formatEntry => formatEntry !== undefined);

function loadLogger() {
	const logger = createLogger({
		levels,
		level: logLevel,
		format: format.combine(...customFormat),
		transports: [new transports.Console()],
	});

	function logError(
		message: string,
		error: Error,
		level: 'debug' | 'info' | 'warning' | 'error' | 'crit',
		...arguments_: unknown[]
	) {
		logger.log(level, message, {
			errorName: error.name,
			errorMessage: error.message,
			errorStack: error.stack,
			...arguments_,
		});
	}

	(logger as unknown as {logError: typeof logError}).logError = logError;

	return logger as winston.Logger & {logError: typeof logError};
}

export const logger = loadLogger();
