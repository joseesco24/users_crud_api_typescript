/** @format */
/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: rest controllers imports
import { RestControllersModule } from "@rest_controllers/rest-controllers.module"

@Module({
	imports: [RestControllersModule],
	controllers: [],
	providers: [],
})
export class RestRoutersModule {}
