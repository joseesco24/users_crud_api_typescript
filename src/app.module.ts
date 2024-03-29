/** @format */

// ** info: nestjs imports
import { ClassSerializerInterceptor } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { ConfigModule } from "@nestjs/config"
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { ResourcesModule } from "@artifacts/resources/resources.module"
import { DatetimeModule } from "@artifacts/datetime/datetime.module"
import { LoggingModule } from "@artifacts/logging/logging.module"
import { PathModule } from "@artifacts/path/path.module"
import { UuidModule } from "@artifacts/uuid/uuid.module"
import { EnvModule } from "@artifacts/env/env.module"

// ** info: rest routers imports
import { RestRoutersModule } from "@rest_routers/rest-routers.module"

// ** info: interceptors imports
import { HeadersSignatureManagerInterceptor } from "@interceptors/headers-signature-manager.interceptor"
import { LoggerContextualizerInterceptor } from "@interceptors/logger-contextualizer.interceptor"
import { ResponseValidatorInterceptor } from "@interceptors/response-validator.interceptor"
import { AuthenticationInterceptor } from "@interceptors/authentication.interceptor"
import { ErrorHandlerInterceptor } from "@interceptors/error-handler.interceptor"

// ** info: nest cls imports
import { ClsModule } from "nestjs-cls"

@Module({
	providers: [
		{
			useClass: LoggerContextualizerInterceptor,
			provide: APP_INTERCEPTOR,
		},
		{
			useClass: ErrorHandlerInterceptor,
			provide: APP_INTERCEPTOR,
		},
		{
			useClass: ClassSerializerInterceptor,
			provide: APP_INTERCEPTOR,
		},
		{
			useClass: AuthenticationInterceptor,
			provide: APP_INTERCEPTOR,
		},
		{
			useClass: ResponseValidatorInterceptor,
			provide: APP_INTERCEPTOR,
		},
		{
			useClass: HeadersSignatureManagerInterceptor,
			provide: APP_INTERCEPTOR,
		},
	],
	imports: [
		ConfigModule.forRoot({ envFilePath: ".env" }),
		ClsModule.forRoot({
			middleware: { mount: true },
		}),
		RestRoutersModule,
		ResourcesModule,
		DatetimeModule,
		LoggingModule,
		EnvModule,
		PathModule,
		UuidModule,
	],
})
export class AppModule {}
