/** @format */

import { SwaggerModule, DocumentBuilder, OpenAPIObject } from "@nestjs/swagger"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { posix } from "path"
import helmet from "helmet"

import { development } from "@artifacts/env/configs"

import { AppModule } from "./app.module"

async function main(): Promise<void> {
	// Setting up the main server.

	const app: INestApplication = await NestFactory.create(AppModule)

	// Setting up app global prefix.

	const appPath: string = posix.join("statistical", "shd", "api", "v1")
	app.setGlobalPrefix(appPath)

	// Setting up the main server global pipes.

	app.useGlobalPipes(
		new ValidationPipe({
			forbidNonWhitelisted: true,
			whitelist: true,
			transform: true,
		})
	)

	// Setting up the main server middlewares.

	app.use(helmet())
	app.enableCors()

	// Setting up swagger documentation.

	if (process.env.ENVIRONMENT_MODE === development) {
		const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
			.setTitle("Shd Backend Core Microservice")
			.setVersion("1.0.0")
			.build()
		const document: OpenAPIObject = SwaggerModule.createDocument(app, config)
		SwaggerModule.setup("apispec", app, document)
	}

	// Starting the main server.

	await app.listen(Number(process.env.PORT as string) || 3000)
}

main()
