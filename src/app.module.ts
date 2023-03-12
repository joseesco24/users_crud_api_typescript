/** @format */

// ** info: nestjs imports
import { ConfigModule } from "@nestjs/config"
import { Module } from "@nestjs/common"

// ** info: nest pino
import { LoggerModule } from "nestjs-pino"

// ** info: artifacts imports
import { DatetimeModule } from "@artifacts/datetime/datetime.module"
import { configSchema } from "@artifacts/env/config.schema"
import { PathModule } from "@artifacts/path/path.module"
import { UuidModule } from "@artifacts/uuid/uuid.module"
import config from "@artifacts/env/config.provider"

const environmentMode: string = process.env.APP_ENVIRONMENT_MODE as string

// todo: move pino config to separated file
const formatters: object = {
	level(label: string) {
		return { severity: label }
	},
}

// todo: move pino config to separated file
const pinoProdConfig: object = {
	pinoHttp: {
		base: { pid: process.pid },
		formatters: formatters,
		messageKey: "message",
		timestamp: false,
		level: "debug",
	},
}

// todo: move pino config to separated file
const pinoDevConfig: object = {
	pinoHttp: {
		transport: {
			target: "pino-pretty",
			options: {
				ignore: "pid,hostname,err",
				levelFirst: true,
				singleLine: true,
				colorize: true,
			},
		},
		level: "debug",
	},
}

let pinoConfig: object

// ** info: selecting logger config
if (environmentMode === "production") {
	pinoConfig = pinoProdConfig
} else {
	pinoConfig = pinoDevConfig
}

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: configSchema,
			envFilePath: ".env",
			load: [config],
			isGlobal: true,
		}),
		LoggerModule.forRoot(pinoConfig),
		DatetimeModule,
		PathModule,
		UuidModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
