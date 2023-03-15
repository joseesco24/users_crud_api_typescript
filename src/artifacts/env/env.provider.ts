/** @format */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

// **info: joi imports
import * as Joi from "joi"

@Injectable()
export class EnvProvider {
	private readonly environmentMode: string[] = ["development", "production", "testing"]
	private readonly loggingMode: string[] = ["structured", "pretty"]

	// ** info: app configs
	private readonly app_environment_mode: string
	private readonly app_logging_mode: string
	private readonly app_server_port: number
	private readonly app_database_health_check_middleware_exclude: Set<string>
	private readonly app_use_database_health_check_middleware: boolean
	private readonly app_authentication_handler_middleware_exclude: Set<string>
	private readonly app_use_authentication_handler_middleware: boolean

	// ** info: users database credentials
	private readonly database_password: string
	private readonly database_logs: boolean
	private readonly database_host: string
	private readonly database_name: string
	private readonly database_port: number
	private readonly database_user: string

	// ** info: cache database credentials
	private readonly cache_database_default_ttl: number
	private readonly cache_database_password: string
	private readonly cache_database_logs: boolean
	private readonly cache_database_host: string
	private readonly cache_database_name: string
	private readonly cache_database_port: number

	public constructor() {
		const envVarsSchema: Joi.ObjectSchema<any> = Joi.object({
			// ** info: app configs
			APP_ENVIRONMENT_MODE: Joi.string()
				.required()
				.valid(...this.environmentMode),
			APP_LOGGING_MODE: Joi.string()
				.required()
				.valid(...this.loggingMode),
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

		// eslint-disable-next-line @typescript-eslint/typedef
		const { error, value: envVars } = envVarsSchema.validate(process.env, { abortEarly: false, allowUnknown: true })

		if (error) {
			throw new Error(`Invalid environment variables: ${error.message}`)
		}

		// ** info: app configs
		this.app_environment_mode = envVars.APP_ENVIRONMENT_MODE
		this.app_logging_mode = envVars.APP_LOGGING_MODE
		this.app_server_port = envVars.APP_SERVER_PORT
		this.app_database_health_check_middleware_exclude = new Set(envVars.APP_DATABASE_HEALTH_CHECK_MIDDLEWARE_EXCLUDE.split(","))
		this.app_use_database_health_check_middleware = envVars.APP_USE_DATABASE_HEALTH_CHECK_MIDDLEWARE
		this.app_authentication_handler_middleware_exclude = new Set(envVars.APP_AUTHENTICATION_HANDLER_MIDDLEWARE_EXCLUDE.split(","))
		this.app_use_authentication_handler_middleware = envVars.APP_USE_AUTHENTICATION_HANDLER_MIDDLEWARE

		// ** info: users database credentials
		this.database_password = envVars.DATABASE_PASSWORD
		this.database_logs = envVars.DATABASE_LOGS
		this.database_host = envVars.DATABASE_HOST
		this.database_name = envVars.DATABASE_NAME
		this.database_port = envVars.DATABASE_PORT
		this.database_user = envVars.DATABASE_USER

		// ** info: cache database credentials
		this.cache_database_default_ttl = envVars.CACHE_DATABASE_DEFAULT_TTL
		this.cache_database_password = envVars.CACHE_DATABASE_PASSWORD
		this.cache_database_logs = envVars.CACHE_DATABASE_LOGS
		this.cache_database_host = envVars.CACHE_DATABASE_HOST
		this.cache_database_name = envVars.CACHE_DATABASE_NAME
		this.cache_database_port = envVars.CACHE_DATABASE_PORT
	}

	// ** info: app configs
	public appEnvironmentMode(): string {
		return this.app_environment_mode
	}
	public appLoggingMode(): string {
		return this.app_logging_mode
	}
	public appServerPort(): number {
		return this.app_server_port
	}
	public appDatabaseHealthCheckMiddlewareExclude(): Set<string> {
		return this.app_database_health_check_middleware_exclude
	}
	public appUseDatabaseHealthCheckMiddleware(): boolean {
		return this.app_use_database_health_check_middleware
	}
	public appAuthenticationHandlerMiddlewareExclude(): Set<string> {
		return this.app_authentication_handler_middleware_exclude
	}
	public appUseAuthenticationHandlerMiddleware(): boolean {
		return this.app_use_authentication_handler_middleware
	}

	// ** info: users database credentials
	public databasePassword(): string {
		return this.database_password
	}
	public databaseLogs(): boolean {
		return this.database_logs
	}
	public databaseHost(): string {
		return this.database_host
	}
	public databaseName(): string {
		return this.database_name
	}
	public databasePort(): number {
		return this.database_port
	}
	public databaseUser(): string {
		return this.database_user
	}

	// ** info: cache database credentials
	public cacheDatabaseDefaultTtl(): number {
		return this.cache_database_default_ttl
	}
	public cacheDatabasePassword(): string {
		return this.cache_database_password
	}
	public cacheDatabaseLogs(): boolean {
		return this.cache_database_logs
	}
	public cacheDatabaseHost(): string {
		return this.cache_database_host
	}
	public cacheDatabaseName(): string {
		return this.cache_database_name
	}
	public cacheDatabasePort(): number {
		return this.cache_database_port
	}
}
