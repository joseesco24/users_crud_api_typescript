/** @format */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

// ** info: nestjs imports
import { registerAs } from "@nestjs/config"

export default registerAs("config", function () {
	return {
		// ** info: app configs
		app_environment_mode: process.env.APP_ENVIRONMENT_MODE as string,
		app_logging_mode: process.env.APP_LOGGING_MODE as string,
		app_server_port: process.env.APP_SERVER_PORT as number | undefined,
		app_database_health_check_middleware_exclude: new Set((process.env.APP_DATABASE_HEALTH_CHECK_MIDDLEWARE_EXCLUDE as string).split(",")),
		app_use_database_health_check_middleware: process.env.APP_USE_DATABASE_HEALTH_CHECK_MIDDLEWARE as boolean | undefined,
		app_authentication_handler_middleware_exclude: new Set((process.env.APP_AUTHENTICATION_HANDLER_MIDDLEWARE_EXCLUDE as string).split(",")),
		app_use_authentication_handler_middleware: process.env.APP_USE_AUTHENTICATION_HANDLER_MIDDLEWARE as boolean | undefined,

		// ** info: users database credentials
		database_password: process.env.DATABASE_PASSWORD as string,
		database_logs: process.env.DATABASE_LOGS as boolean | undefined,
		database_host: process.env.DATABASE_HOST as string,
		database_name: process.env.DATABASE_NAME as string,
		database_user: process.env.DATABASE_USER as string,
		database_port: process.env.DATABASE_PORT as number | undefined,

		// ** info: cache database credentials
		cache_database_default_ttl: process.env.CACHE_DATABASE_DEFAULT_TTL as number | undefined,
		cache_database_password: process.env.CACHE_DATABASE_PASSWORD as string,
		cache_database_logs: process.env.CACHE_DATABASE_LOGS as boolean | undefined,
		cache_database_host: process.env.CACHE_DATABASE_HOST as string,
		cache_database_name: process.env.CACHE_DATABASE_NAME as string,
		cache_database_port: process.env.CACHE_DATABASE_PORT as number | undefined,
	}
})
