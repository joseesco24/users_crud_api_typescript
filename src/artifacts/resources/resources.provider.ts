/** @format */

// ** info: javascript imports
import { memoryUsage } from "process"
import { cpuUsage } from "process"

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

@Injectable()
export class ResourcesProvider {
	private readonly lastCpuUsage: {
		user: number
		system: number
	} = process.cpuUsage()

	public getMemoryUsage(): number {
		const memoryUsed: number = memoryUsage().heapUsed / 1024 / 1024
		const memoryMax: number = memoryUsage().heapTotal / 1024 / 1024
		const memoryPercentage: number = Math.round((memoryUsed / memoryMax) * 100)
		return memoryPercentage
	}

	public getCpuUsage(): number {
		const cpuUsed: {
			user: number
			system: number
		} = cpuUsage(this.lastCpuUsage)
		const cpuPercentage: number = Math.round(((cpuUsed.user + cpuUsed.system) / (this.lastCpuUsage.user + this.lastCpuUsage.system)) * 100)
		return cpuPercentage
	}
}
