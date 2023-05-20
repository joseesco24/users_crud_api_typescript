/** @format */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

// **info: joi imports
import * as Joi from "joi"

/**
 * Clase encargada de cargar, validar y proveer acceso a las variables de entorno
 * @date 25/4/2023 - 10:55:34
 *
 * @export
 * @class EnvProvider
 * @typedef {EnvProvider}
 */
@Injectable()
export class EnvProvider {
	public readonly environmentMode: string[] = ["development", "production", "testing"]
	public readonly loggingLevel: string[] = ["debug", "info", "warning", "error"]
	public readonly loggingMode: string[] = ["structured", "pretty"]

	// ** info: app configs
	public readonly appEnvironmentMode: string
	public readonly appLoggingMode: string
	public readonly appLoggingLevel: string
	public readonly appServerPort: number
	public readonly appAuthenticationHandlerMiddlewareExclude: Set<string>
	public readonly appUseAuthenticationHandlerMiddleware: boolean
	public readonly appUseCacheDatabaseMock: boolean
	public readonly appRequestMaxPayload: number

	public constructor() {
		const envVarsSchema: Joi.ObjectSchema<any> = Joi.object({
			// ** info: app configs
			APP_ENVIRONMENT_MODE: Joi.string()
				.required()
				.valid(...this.environmentMode),
			APP_LOGGING_LEVEL: Joi.string()
				.required()
				.valid(...this.loggingLevel),
			APP_LOGGING_MODE: Joi.string()
				.required()
				.valid(...this.loggingMode),
			APP_SERVER_PORT: Joi.number().required(),
			APP_AUTHENTICATION_HANDLER_MIDDLEWARE_EXCLUDE: Joi.string().required(),
			APP_USE_AUTHENTICATION_HANDLER_MIDDLEWARE: Joi.bool().required(),
			APP_USE_CACHE_DATABASE_MOCK: Joi.bool().required(),
			APP_REQUEST_MAX_PAYLOAD: Joi.number().required(),
		})

		// eslint-disable-next-line @typescript-eslint/typedef
		const { error, value: envVars } = envVarsSchema.validate(process.env, { abortEarly: false, allowUnknown: true })

		if (error) {
			throw new Error(`Invalid environment variables: ${error.message}`)
		}

		// ** info: app configs
		this.appEnvironmentMode = envVars.APP_ENVIRONMENT_MODE
		this.appLoggingMode = envVars.APP_LOGGING_MODE
		this.appLoggingLevel = envVars.APP_LOGGING_LEVEL
		this.appServerPort = envVars.APP_SERVER_PORT
		this.appAuthenticationHandlerMiddlewareExclude = new Set(envVars.APP_AUTHENTICATION_HANDLER_MIDDLEWARE_EXCLUDE.split(","))
		this.appUseAuthenticationHandlerMiddleware = envVars.APP_USE_AUTHENTICATION_HANDLER_MIDDLEWARE
		this.appUseCacheDatabaseMock = envVars.APP_USE_CACHE_DATABASE_MOCK
		this.appRequestMaxPayload = envVars.APP_REQUEST_MAX_PAYLOAD
	}
}
