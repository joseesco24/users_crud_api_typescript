/** @format */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Joi from "joi"

const environmentMode: string[] = ["development", "production", "testing"]
const loggingMode: string[] = ["structured", "pretty"]

export const configSchema: Joi.ObjectSchema<any> = Joi.object({
	// ** info: app configs
	APP_ENVIRONMENT_MODE: Joi.string()
		.required()
		.valid(...environmentMode),
	APP_LOGGING_MODE: Joi.string()
		.required()
		.valid(...loggingMode),
	APP_SERVER_PORT: Joi.number().required(),
	APP_DATABASE_HEALTH_CHECK_MIDDLEWARE_EXCLUDE: Joi.string().required(),
	APP_USE_DATABASE_HEALTH_CHECK_MIDDLEWARE: Joi.bool().required(),
	APP_AUTHENTICATION_HANDLER_MIDDLEWARE_EXCLUDE: Joi.string().required(),
	APP_USE_AUTHENTICATION_HANDLER_MIDDLEWARE: Joi.bool().required(),

	// ** info: users database credentials
	DATABASE_PASSWORD: Joi.string().required(),
	DATABASE_LOGS: Joi.bool().required(),
	DATABASE_HOST: Joi.string().required(),
	DATABASE_NAME: Joi.string().required(),
	DATABASE_USER: Joi.string().required(),
	DATABASE_PORT: Joi.number().required(),

	// ** info: cache database credentials
	CACHE_DATABASE_DEFAULT_TTL: Joi.number().required(),
	CACHE_DATABASE_PASSWORD: Joi.string().required(),
	CACHE_DATABASE_LOGS: Joi.bool().required(),
	CACHE_DATABASE_HOST: Joi.string().required(),
	CACHE_DATABASE_NAME: Joi.number().required(),
	CACHE_DATABASE_PORT: Joi.number().required(),
})
