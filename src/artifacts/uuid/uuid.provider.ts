/** @format */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

// ** info: uuid imports
import { v4 } from "uuid"

/**
 * Clase encargada de proveer métodos para trabajar con uuid
 * @date 25/4/2023 - 10:58:41
 *
 * @export
 * @class UuidProvider
 * @typedef {UuidProvider}
 */
@Injectable()
export class UuidProvider {
	/**
	 * Método encargado de proveer un nuevo uuidv4 como string
	 * @date 25/4/2023 - 10:59:20
	 *
	 * @public
	 * @returns {string}
	 */
	public getStrUuid(): string {
		return v4()
	}
}
