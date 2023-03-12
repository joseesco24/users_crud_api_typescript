/** @format */

// ** info: nestjs imports
import { ConfigModule } from "@nestjs/config"
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { DatetimeModule } from "@artifacts/datetime/datetime.module"
import { validationSchema } from "@artifacts/env/validation-schema"
import { PathModule } from "@artifacts/path/path.module"
import config from "@artifacts/env/config"

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: validationSchema,
			envFilePath: ".env",
			load: [config],
			isGlobal: true,
		}),
		DatetimeModule,
		PathModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}