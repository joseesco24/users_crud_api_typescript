/** @format */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

// ** info: artifacts imports
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"
import { UuidProvider } from "@artifacts/uuid/uuid.provider"

/**
 * Clase encargada de cargar y proveer constantes que no se alteran durante la ejecucion de la instancia del servicio
 * @date 26/4/2023 - 18:50:27
 *
 * @export
 * @class ExecutionConstantsProvider
 * @typedef {ExecutionConstantsProvider}
 */
@Injectable()
export class ExecutionConstantsProvider {
	public readonly serviceName: string = "adhesives-stock-mgmt-svc"
	public readonly serviceVersion: string = "1.0.0"
	public readonly serviceStartTime: Date
	public readonly serviceId: string

	public constructor(private readonly datetimeProvider: DatetimeProvider, private readonly uuidProvider: UuidProvider) {
		this.serviceStartTime = datetimeProvider.getColDate()
		this.serviceId = uuidProvider.getStrUuid()
	}
}
