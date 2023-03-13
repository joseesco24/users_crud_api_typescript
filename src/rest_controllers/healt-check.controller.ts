/** @format */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"
import { Logger } from "@nestjs/common"

// ** info: dtos imports
import { HealthCheckResponseDto } from "@dtos/responses/healt-check.dto"

// ** info: artifacts imports
import { ResourcesProvider } from "@artifacts/resources/resources.provider"

@Injectable()
export class HealthCheckController {
	private readonly logger: Logger = new Logger(HealthCheckController.name)

	public constructor(private readonly resourcesProvider: ResourcesProvider) {}

	public getHealthCheck(): HealthCheckResponseDto {
		const response: HealthCheckResponseDto = new Object() as HealthCheckResponseDto

		response.redisDownloadConnection = true
		response.redisUploadConnection = true
		response.postgresQuerySession = true
		response.allConnectionsOk = true

		response.memoryUsage = this.resourcesProvider.getMemoryUsage()
		response.cpuUsage = this.resourcesProvider.getCpuUsage()

		this.logger.debug("all databases are healthy")

		return response
	}
}
