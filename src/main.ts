/** @format */

// ** info: javascript imports
import helmet from "helmet"

// ** info: nestjs imports
import { INestApplication } from "@nestjs/common"
import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"

// ** info: nestjs pino imports
import { Logger } from "nestjs-pino"

// ** info: app module imports
import { AppModule } from "./app.module"

async function main(): Promise<void> {
	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up the main server
	// ---------------------------------------------------------------------------------------------------------------------
	const app: INestApplication = await NestFactory.create(AppModule, {
		bufferLogs: true,
	})
	app.useLogger(app.get(Logger))

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up the main server global pipes
	// ---------------------------------------------------------------------------------------------------------------------
	app.useGlobalPipes(
		new ValidationPipe({
			forbidNonWhitelisted: true,
			whitelist: true,
			transform: true,
		})
	)

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: setting up the main server middlewares
	// ---------------------------------------------------------------------------------------------------------------------
	app.use(helmet())
	app.enableCors()

	// ---------------------------------------------------------------------------------------------------------------------
	// ** info: starting the main server
	// ---------------------------------------------------------------------------------------------------------------------
	await app.listen(Number(process.env.APP_SERVER_PORT as string))
}

main()
