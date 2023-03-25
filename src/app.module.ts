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

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: ".env" }),
		RestRoutersModule,
		ResourcesModule,
		DatetimeModule,
		LoggingModule,
		EnvModule,
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
