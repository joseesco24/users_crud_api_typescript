/** @format */

// ** info: nestjs imports
import { ConfigModule } from "@nestjs/config"
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { DatetimeModule } from "@artifacts/datetime/datetime.module"
import { configSchema } from "@artifacts/env/config.schema"
import { PathModule } from "@artifacts/path/path.module"
import { UuidModule } from "@artifacts/uuid/uuid.module"
import config from "@artifacts/env/config.provider"

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: configSchema,
			envFilePath: ".env",
			load: [config],
			isGlobal: true,
		}),
		DatetimeModule,
		PathModule,
		UuidModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
