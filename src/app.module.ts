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
import { LoggingModule } from "@artifacts/logging/logging.module"
import { configSchema } from "@artifacts/env/config.schema"
import { PathModule } from "@artifacts/path/path.module"
import { UuidModule } from "@artifacts/uuid/uuid.module"

import { LoggingProvider } from "@artifacts/logging/logging.provider"

// ** info: configs imports
import config from "@artifacts/env/config.provider"

// ** info: rest routers imports
import { RestRoutersModule } from "@rest_routers/rest-routers.module"

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
		LoggerModule.forRootAsync({
			useFactory: (loggingProvider: LoggingProvider): object => {
				return loggingProvider.getLoggerConfig()
			},
			inject: [LoggingProvider],
			imports: [LoggingModule],
		}),
		RestRoutersModule,
		ResourcesModule,
		DatetimeModule,
		LoggingModule,
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
