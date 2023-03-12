/** @format */

// ** info: nestjs imports
import { ConfigModule } from "@nestjs/config"
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { validationSchema } from "@artifacts/env/validation_schema"
import config from "@artifacts/env/config"

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: validationSchema,
			envFilePath: ".env",
			load: [config],
			isGlobal: true,
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
