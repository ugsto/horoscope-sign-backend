import {host as defaultHost, port as defaultPort} from './defaults';
import {logger} from './loaders/logger';
import {loadServer} from './loaders/server';
import {getEnvironment} from './utils/get-environment';

function main() {
	const server = loadServer();
	const host = getEnvironment('HOST', defaultHost);
	const port = Number.parseInt(
		getEnvironment('PORT', String(defaultPort)),
		10,
	);

	server.listen(port, host, () => {
		logger.info(`Server listening on ${host}:${port}`);
	});
}

main();
