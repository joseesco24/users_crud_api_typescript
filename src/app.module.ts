/** @format */

// ** info: nestjs imports
import { ClassSerializerInterceptor } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { ConfigModule } from "@nestjs/config"
import { Module } from "@nestjs/common"

// ** info: nest pino
import { LoggerModule } from "nestjs-pino"

// ** info: artifacts imports
import { ResourcesModule } from "@artifacts/resources/resources.module"
import { DatetimeModule } from "@artifacts/datetime/datetime.module"
import { configSchema } from "@artifacts/env/config.schema"
import { PathModule } from "@artifacts/path/path.module"
import { UuidModule } from "@artifacts/uuid/uuid.module"

// ** info: configs imports
import config from "@artifacts/env/config.provider"

// ** info: rest routers imports
import { RestRoutersModule } from "@rest_routers/rest-routers.module"

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

// todo: move env config to separated file
const configOptions: object = {
	validationSchema: configSchema,
	envFilePath: ".env",
	load: [config],
	isGlobal: true,
}

@Module({
	imports: [
		ConfigModule.forRoot(configOptions),
		LoggerModule.forRoot(pinoConfig),
		RestRoutersModule,
		ResourcesModule,
		DatetimeModule,
		PathModule,
		UuidModule,
	],
	providers: [
		{
			useClass: ClassSerializerInterceptor,
			provide: APP_INTERCEPTOR,
		},
	],
})
export class AppModule {}
