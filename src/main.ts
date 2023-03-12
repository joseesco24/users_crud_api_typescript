/** @format */

// ** info: javascript imports
import helmet from "helmet"

// ** info: nestjs imports
import { INestApplication } from "@nestjs/common"
import { DocumentBuilder } from "@nestjs/swagger"
import { SwaggerModule } from "@nestjs/swagger"
import { OpenAPIObject } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"

// ** info: app module imports
import { AppModule } from "./app.module"

async function main(): Promise<void> {
	// Setting up the main server.

	const app: INestApplication = await NestFactory.create(AppModule)

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

	if (process.env.ENVIRONMENT_MODE === "development") {
		const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder().build()
		const document: OpenAPIObject = SwaggerModule.createDocument(app, config)
		SwaggerModule.setup("apispec", app, document)
	}

	// Starting the main server.

	await app.listen(Number(process.env.PORT as string) || 3000)
}

main()
