/** @format */
/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: rest controllers imports
import { HealthCheckController } from "@rest_controllers/healt-check.controller"

// ** info: artifacts imports
import { ResourcesModule } from "@artifacts/resources/resources.module"

@Module({
	imports: [ResourcesModule],
	exports: [HealthCheckController],
	providers: [HealthCheckController],
})
export class RestControllersModule {}
