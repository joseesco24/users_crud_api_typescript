/** @format */

// ** info: class validator imports
import { IsISO31661Alpha2 } from "class-validator"
import { IsNumberString } from "class-validator"
import { ValidateNested } from "class-validator"
import { IsNotEmpty } from "class-validator"
import { IsOptional } from "class-validator"
import { IsObject } from "class-validator"
import { IsString } from "class-validator"
import { IsUUID } from "class-validator"
import { Length } from "class-validator"
import { IsIP } from "class-validator"

// ** info: class transformer imports
import { Type } from "class-transformer"

/**
 * Dto encargado de validar el atributo header al interior del body de las peticiones entrantes
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

	@IsISO31661Alpha2({ message: "El código del país debe ser una cadena de caracteres iso 31661 alfa 2" })
	@IsString({ message: "El código del país debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El código del país no puede estar vacío" })
	public countryCode!: string

	@Length(1, 4, {
		message: "El identificador del canal debe ser una cadena de caracteres de entre uno y cuatro caracteres compuesta solo de números",
	})
	// eslint-disable-next-line @typescript-eslint/naming-convention
	@IsNumberString({ no_symbols: true }, { message: "El identificador del canal debe ser una cadena de caracteres compuesta solo de números" })
	@IsString({ message: "El identificador del canal debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El identificador del canal no puede estar vacío" })
	public channelId!: string

	@IsIP(4, { message: "La dirección ip del cliente debe ser una ip versión 4 válida" })
	@IsString({ message: "La dirección ip del cliente debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "La dirección ip del cliente no puede estar vacía" })
	public sourceIp!: string

	@IsString({ message: "El identificador del cliente debe ser una cadena de caracteres" })
	@IsNotEmpty({ message: "El identificador del cliente no puede estar vacío" })
	public clientId!: string

	public constructor(obj: object) {
		if ("traceabilityId" in obj) {
			this.traceabilityId = obj.traceabilityId as string
		}
		if ("countryCode" in obj) {
			this.countryCode = obj.countryCode as string
		}
		if ("channelId" in obj) {
			this.channelId = obj.channelId as string
		}
		if ("sourceIp" in obj) {
			this.sourceIp = obj.sourceIp as string
		}
		if ("clientId" in obj) {
			this.clientId = obj.clientId as string
		}
	}
}

/**
 * Dto encargado de validar el body de las peticiones entrantes
 * @date 1/5/2023 - 17:15:29
 *
 * @export
 * @class RequestSignaturesDto
 * @typedef {RequestSignaturesDto}
 */
export class RequestSignaturesDto {
	@ValidateNested({ message: "Encabezados de la petición inválidos" })
	@IsNotEmpty({ message: "Encabezados de la petición faltantes" })
	@Type(() => HeaderSignaturesDto)
	public header!: HeaderSignaturesDto

	@IsObject({ message: "Datos de la petición inválidos" })
	@IsOptional({ message: "Datos de la petición faltantes" })
	public data!: object

	public constructor(obj: object) {
		if ("header" in obj) {
			this.header = new HeaderSignaturesDto(obj.header as object)
		}
		if ("data" in obj) {
			this.data = obj.data as object
		}
	}
}
