/** @format */
/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { ResourcesModule } from "@artifacts/resources/resources.module"

@Module({
	imports: [ResourcesModule],
	exports: [],
	providers: [],
})
export class RestControllersModule {}
