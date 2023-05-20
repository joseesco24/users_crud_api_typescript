/** @format */

// ** info: javascript imports
import helmet from "helmet"

// ** info: express imports
import { json } from "express"

// ** info: nestjs imports
import { INestApplication } from "@nestjs/common"
import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"

// ** info: app module imports
import { AppModule } from "./app.module"

// ** info: artifacts imports
import { ExecutionConstantsModule } from "@artifacts/execution-constants/execution-constants.module"
import { LoggingProvider } from "@artifacts/logging/logging.provider"
import { DatetimeModule } from "@artifacts/datetime/datetime.module"
import { LoggingModule } from "@artifacts/logging/logging.module"
import { EnvProvider } from "@artifacts/env/env.provider"
import { EnvModule } from "@artifacts/env/env.module"

/**
 * Método encargado de ensamblar y ejecutar aplicación
 * @date 27/4/2023 - 8:35:36
 *
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up the main server
	// ---------------------------------------------------------------------------------------------------------------------
	const app: INestApplication = await NestFactory.create(AppModule, {
		bufferLogs: true,
	})

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up env module
	// ---------------------------------------------------------------------------------------------------------------------
	await NestFactory.create(EnvModule)
	const envProvider: EnvProvider = app.get(EnvProvider)

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up datetime module
	// ---------------------------------------------------------------------------------------------------------------------
	await NestFactory.create(DatetimeModule)

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up execution constants module
	// ---------------------------------------------------------------------------------------------------------------------
	await NestFactory.create(ExecutionConstantsModule)

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up logging module
	// ---------------------------------------------------------------------------------------------------------------------
	await NestFactory.create(LoggingModule)
	const loggingProvider: LoggingProvider = app.get(LoggingProvider)

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up logging
	// ---------------------------------------------------------------------------------------------------------------------
	app.useLogger(loggingProvider)

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up the main server global pipes
	// ---------------------------------------------------------------------------------------------------------------------
	app.useGlobalPipes(
		new ValidationPipe({
			forbidNonWhitelisted: true,
			stopAtFirstError: true,
			transform: false,
			whitelist: false,
		})
	)

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up helmet
	// ---------------------------------------------------------------------------------------------------------------------
	app.use(helmet())

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up cors
	// ---------------------------------------------------------------------------------------------------------------------
	app.enableCors()

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up max request size on mega bytes
	// ---------------------------------------------------------------------------------------------------------------------
	app.use(json({ limit: `${envProvider.appRequestMaxPayload}mb` }))

	loggingProvider.info(`Applicattion running on port: ${envProvider.appServerPort}`)
	loggingProvider.info(`Logger level setup on ${envProvider.appLoggingLevel} mode`)
	loggingProvider.info(`Logger setup on ${envProvider.appLoggingMode} mode`)
	loggingProvider.info(`Request max payload setup to: ${envProvider.appRequestMaxPayload}mb`)

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: starting the main server
	// ---------------------------------------------------------------------------------------------------------------------
	await app.listen(Number(envProvider.appServerPort))
}

main()
