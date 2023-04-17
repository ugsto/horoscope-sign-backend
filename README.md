# Sign API

This application is a simple sign horoscope generator. The results come from
the [ChatGPT API](https://platform.openai.com/docs/guides/chat) with a prompt
that is based on the user's sign.

## Configuration

The application is configured using environment variables. The following
variables are available:

| Variable    | Description                      | Default                                    |
| ----------- | -------------------------------- | ------------------------------------------ |
| GPT_URL     | The URL of the GPT API           | https://api.openai.com/v1/chat/completions |
| GPT_API_KEY | The API key for the GPT API      |                                            |
| GPT_MODEL   | The model to use for the GPT API | gpt-3.5-turbo                              |
| HOST        | The host to bind to              | 0.0.0.0                                    |
| PORT        | The port to bind to              | 3000                                       |

They can be set in a `.env` file in the root of the project. There is a
`.env.example` file that can be used as a template.

Please note that the application requires a valid API key for the GPT API. You
can get one by signing up for an account at [OpenAI](https://openai.com/) and
creating an API key at [API Keys](https://platform.openai.com/account/api-keys).

## Scripts

The following scripts are available:

| Script          | Description                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| start:dev       | Starts the application in development mode                                                 |
| start:prod      | Starts the application in production mode                                                  |
| build           | Builds the application                                                                     |
| lint            | Runs ESLint on the source code                                                             |
| format:eslint   | Runs ESLint on the source code and fixes any issues that can be automatically              |
| format:prettier | Runs Prettier on the source code and fixes any issues that can be automatically            |
| format          | Runs ESLint and Prettier on the source code and fixes any issues that can be automatically |
| test            | Runs the test suite                                                                        |

## Development

The application is written in TypeScript using Express to serve the API. In order to
run the application in development mode, you will need to have Node.js installed.
After cloning the repository, you can install the dependencies by running:

```bash
npm install
```

Once the dependencies are installed, you can start the application by running:

```bash
npm run start:dev
```

This will start the application in development mode. The application will be
available at http://localhost:3000.

## Production

The application can be built and run in production mode using Docker. To build
the application, run:

```bash
docker build -t sign .
```

This will create a Docker image called `sign`. To run the application, run:

```bash
docker run -p 3000:3000 sign
```

This will start the application on port 3000. The application will be available
at http://localhost:3000.

## How to use

```bash
curl http://localhost:3000/api/v1/sign/aries
```
