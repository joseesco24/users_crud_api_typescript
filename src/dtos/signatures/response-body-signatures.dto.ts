/** @format */

// ** info: class validator imports
import { ValidateNested } from "class-validator"
import { IsNotEmpty } from "class-validator"
import { IsDefined } from "class-validator"
import { IsString } from "class-validator"
import { Matches } from "class-validator"
import { IsUUID } from "class-validator"
import { IsInt } from "class-validator"

// ** info: class transformer imports
import { Type } from "class-transformer"

/**
 * Dto encargado de validar el atributo response al interior del atributo header de las respuestas
 * @date 1/5/2023 - 17:15:29
 *
 * @export
 * @class RequestHeadersSignaturesDto
 * @typedef {ResponseHeadersResponseSignaturesDto}
 */
export class ResponseHeadersResponseSignaturesDto {
	@IsString({ message: "El mensaje de usuario debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El mensaje de usuario no puede estar vacío" })
	public userMessage!: string

	@IsString({ message: "El mensaje técnico debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El mensaje técnico no puede estar vacío" })
	public technicalMessage!: string

	@IsInt({ message: "El código de respuesta debe ser un número entero" })
	@IsNotEmpty({ message: "El código de respuesta no puede estar vacío" })
	public responseCode!: number

	public constructor(obj: object) {
		if ("userMessage" in obj) {
			this.userMessage = obj.userMessage as string
		}
		if ("technicalMessage" in obj) {
			this.technicalMessage = obj.technicalMessage as string
		}
		if ("responseCode" in obj) {
			this.responseCode = obj.responseCode as number
		}
	}
}

/**
 * Dto encargado de validar el atributo header al interior del body de las respuestas
 * @date 1/5/2023 - 17:15:29
 *
 * @export
 * @class HeaderSignaturesDto
 * @typedef {HeaderSignaturesDto}
 */
export class HeaderSignaturesDto {
	@IsUUID(4, { message: "El identificador de trazabilidad debe ser un uuid versión 4 válido" })
	@IsString({ message: "El identificador de trazabilidad debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El identificador de trazabilidad no puede estar vacío" })
	public traceabilityId!: string

	// todo: definir las firmas
	/**
	@Matches(RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}$"), {
		message: "El timestamp de inicio debe ser una cadena de caracteres de tipo YYYY-MM-DD HH:MM:SS.lll",
	})
	@IsString({ message: "El timestamp de iniciodebe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El timestamp de inicio debe no puede estar vacío" })
	public requestStartTimeStamp!: string
	*/

	@Matches(RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}$"), {
		message: "El timestamp de fin debe ser una cadena de caracteres de tipo YYYY-MM-DD HH:MM:SS.lll",
	})
	@IsString({ message: "El timestamp de fin debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El timestamp de fin debe no puede estar vacío" })
	public timeStamp!: string

	// todo: definir las firmas
	/**
	@IsString({ message: "El tiempo transcurrido debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El tiempo transcurrido no puede estar vacío" })
	public requestElapsedTime!: string
	*/

	@ValidateNested({ message: "Subencabezados de respuesta de la petición inválidos" })
	@IsNotEmpty({ message: "Subencabezados de respuesta de la petición faltantes" })
	@Type(() => ResponseHeadersResponseSignaturesDto)
	public response!: ResponseHeadersResponseSignaturesDto

	public constructor(obj: object) {
		if ("traceabilityId" in obj) {
			this.traceabilityId = obj.traceabilityId as string
		}
		if ("timeStamp" in obj) {
			this.timeStamp = obj.timeStamp as string
		}
		if ("response" in obj) {
			const responseBody: ResponseHeadersResponseSignaturesDto = new ResponseHeadersResponseSignaturesDto(obj.response as object)
			this.response = responseBody
		}
	}
}

/**
 * Dto encargado de validar el body de las respuestas
 * @date 1/5/2023 - 17:15:29
 *
 * @export
 * @class ResponseSignaturesDto
 * @typedef {ResponseSignaturesDto}
 */
export class ResponseSignaturesDto {
	@ValidateNested({ message: "Encabezados de respuesta de la petición inválidos" })
	@IsNotEmpty({ message: "Encabezados de respuesta de la petición faltantes" })
	@Type(() => HeaderSignaturesDto)
	public header!: HeaderSignaturesDto

	@ValidateNested({ message: "Datos de la respuesta inválidos" })
	@IsDefined({ message: "Datos de la respuesta faltantes" })
	public data!: object

	public constructor(obj: object) {
		if ("header" in obj) {
			const headerBody: HeaderSignaturesDto = new HeaderSignaturesDto(obj.header as object)
			this.header = headerBody
		}
		if ("data" in obj) {
			this.data = obj.data as object
		}
	}
}
