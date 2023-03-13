/** @format */
/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { HealthCheckRouter } from "@rest_routers/healt-check.router"

// ** info: rest controllers imports
import { RestControllersModule } from "@rest_controllers/rest-controllers.module"

@Module({
	imports: [RestControllersModule],
	controllers: [HealthCheckRouter],
	providers: [HealthCheckRouter],
})
export class RestRoutersModule {}
