/** @format */

import { IsNotEmpty } from "class-validator"
import { IsNumber } from "class-validator"
import { IsBoolean } from "class-validator"

export class HealthCheckResponseDto {
	@IsBoolean()
	@IsNotEmpty()
	public redisDownloadConnection!: boolean

	@IsBoolean()
	@IsNotEmpty()
	public redisUploadConnection!: boolean

	@IsBoolean()
	@IsNotEmpty()
	public postgresQuerySession!: boolean

	@IsBoolean()
	@IsNotEmpty()
	public allConnectionsOk!: boolean

	@IsNumber()
	@IsNotEmpty()
	public memoryUsage!: number

	@IsNumber()
	@IsNotEmpty()
	public cpuUsage!: number
}
