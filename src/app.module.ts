/** @format */

import { ConfigModule } from "@nestjs/config"
import { Module } from "@nestjs/common"

import { validationSchema } from "@commons-artifacts/config/app-validation.schema"
import config from "@commons-artifacts/config/app.config"

import { MovementsModule } from "@movements/movements.module"

const environmentMode: string = process.env.ENVIRONMENT_MODE as string
const isProduction: boolean = environmentMode !== "production"

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: validationSchema,
			ignoreEnvFile: !isProduction,
			envFilePath: ".env",
			load: [config],
			isGlobal: true,
		}),
		MovementsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
