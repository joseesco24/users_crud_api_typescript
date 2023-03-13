/** @format */

// ** info: nestjs imports
import { Controller } from "@nestjs/common"
import { HttpStatus } from "@nestjs/common"
import { HttpCode } from "@nestjs/common"
import { Get } from "@nestjs/common"

// ** info: controllers imports
import { HealthCheckController } from "@rest_controllers/healt-check.controller"

// ** info: dtos imports
import { HealthCheckResponseDto } from "@dtos/responses/healt-check.dto"

const endpointPath: string = "rest/health-check"

@Controller(endpointPath)
export class HealthCheckRouter {
	public constructor(private readonly healthCheckController: HealthCheckController) {}

	@Get("is-everything-ok")
	@HttpCode(HttpStatus.OK)
	public getHealthCheck(): HealthCheckResponseDto {
		const response: HealthCheckResponseDto = this.healthCheckController.getHealthCheck()
		return response
	}
}
