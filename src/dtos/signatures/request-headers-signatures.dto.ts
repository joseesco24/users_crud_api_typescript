/** @format */

// ** info: class validator imports
import { IsNotEmpty } from "class-validator"
import { IsString } from "class-validator"
import { IsUUID } from "class-validator"

/**
 * Dto encargado de validar los headers http de las peticiones entrantes
 * @date 1/5/2023 - 17:15:29
 *
 * @export
 * @class RequestHeadersSignaturesDto
 * @typedef {RequestHeadersSignaturesDto}
 */
export class RequestHeadersSignaturesDto {
	@IsString({ message: "El atributo consumer-id de los headers http de la petición debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El atributo consumer-id de los headers http de la petición debe estar definido" })
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public "consumer-id"!: string

	@IsUUID(4, { message: "El atributo session-id de los headers http de la petición debe ser un uuid versión 4 válido" })
	@IsString({ message: "El atributo session-id de los headers http de la petición debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El atributo session-id de los headers http de la petición debe estar definido" })
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public "session-id"!: string

	@IsString({ message: "El atributo iv de los headers http de la petición debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El atributo iv de los headers http de la petición debe estar definido" })
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public "iv"!: string

	@IsString({ message: "El atributo jwt de los headers http de la petición debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El atributo jwt de los headers http de la petición debe estar definido" })
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public "jwt"!: string

	@IsString({ message: "El atributo user-agent de los headers http de la petición debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El atributo user-agent de los headers http de la petición debe estar definido" })
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public "user-agent"!: string

	public "constructor"(obj: object) {
		if ("consumer-id" in obj) {
			this["consumer-id"] = obj["consumer-id"] as string
		}
		if ("session-id" in obj) {
			this["session-id"] = obj["session-id"] as string
		}
		if ("iv" in obj) {
			this["iv"] = obj["iv"] as string
		}
		if ("jwt" in obj) {
			this["jwt"] = obj["jwt"] as string
		}
		if ("user-agent" in obj) {
			this["user-agent"] = obj["user-agent"] as string
		}
	}
}
