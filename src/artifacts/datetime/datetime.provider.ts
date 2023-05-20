/** @format */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

/**
 * Clase encargada de proveer métodos para trabajar con fechas
 * @date 25/4/2023 - 10:56:41
 *
 * @export
 * @class DatetimeProvider
 * @typedef {DatetimeProvider}
 */
@Injectable()
export class DatetimeProvider {
	/**
	 * Método encargado de proveer un objeto de tipo Date actualizado con la hora colombiana indistintamente de la hora del sistema
	 * @date 25/4/2023 - 9:28:09
	 *
	 * @public
	 * @returns {Date}
	 */
	public getColDate(): Date {
		const date: Date = new Date()
		const utcTime: Date = new Date(
			Date.UTC(
				date.getUTCFullYear(),
				date.getUTCMonth(),
				date.getUTCDate(),
				date.getUTCHours(),
				date.getUTCMinutes(),
				date.getUTCSeconds(),
				date.getUTCMilliseconds()
			)
		)
		const oneHoure: number = 60 * 60 * 1000
		const hoursOffset: number = 5
		const colTime: Date = new Date(utcTime.getTime() - hoursOffset * oneHoure)
		return colTime
	}

	/**
	 * Método encargado de proveer un string en formato yyyy-mm-dd HH:MM:ss.l iso 8601 actualizado con la hora colombiana indistintamente de la hora del sistema
	 * @date 25/4/2023 - 9:28:09
	 *
	 * @public
	 * @returns {Date}
	 */
	public getColTimePrettyString(): string {
		const colTime: Date = this.getColDate()
		const colTimePrettyString: string = this.getPrettyDateString(colTime)
		return colTimePrettyString
	}

	/**
	 * Método encargado de prover una representacion de un objeto de tipo date formteado
	 * @date 25/4/2023 - 9:28:09
	 *
	 * @public
	 * @returns {Date}
	 */
	public getPrettyDateString(date: Date): string {
		const prettyDateString: string = date.toISOString().replace("T", " ").replace("Z", "")
		return prettyDateString
	}

	/**
	 * Método encargado de proveer un string que indique el tiempo de diferencia que hay entre dos fechas en milidegundos
	 * @date 28/4/2023 - 18:47:52
	 *
	 * @public
	 * @returns {string}
	 */
	public datesDiffStringMs(date1: Date, date2: Date): string {
		const elapsedTime: number = Math.abs(date1.getTime() - date2.getTime())
		const elapsedTimeFormatted: string = `${elapsedTime}ms`
		return elapsedTimeFormatted
	}

	/**
	 * Método encargado de proveer un string que indique el tiempo de diferencia que hay entre dos fechas en años, meses, dias, horas, minutos, segundos y milidegundos
	 * @date 26/4/2023 - 19:24:36
	 *
	 * @public
	 * @param {Date} date1
	 * @param {Date} date2
	 * @returns {string}
	 */
	public datesDiffStringFull(date1: Date, date2: Date): string {
		const diff: number = Math.abs(date2.getTime() - date1.getTime())

		const miliseconds: number = diff % 1000
		const seconds: number = Math.floor(diff / 1000) % 60
		const minutes: number = Math.floor(diff / (1000 * 60)) % 60
		const houres: number = Math.floor(diff / (1000 * 60 * 60)) % 24
		const days: number = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30
		const months: number = Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) % 12
		const years: number = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))

		const elapsedTimeString: string[] = []
		if (years > 0) {
			elapsedTimeString.push(`${years} year${years > 1 ? "s" : ""}`)
		}
		if (months > 0) {
			elapsedTimeString.push(`${months} month${months > 1 ? "s" : ""}`)
		}
		if (days > 0) {
			elapsedTimeString.push(`${days} day${days > 1 ? "s" : ""}`)
		}
		if (houres > 0) {
			elapsedTimeString.push(`${houres} houre${houres > 1 ? "s" : ""}`)
		}
		if (minutes > 0) {
			elapsedTimeString.push(`${minutes} minute${minutes > 1 ? "s" : ""}`)
		}
		if (seconds > 0) {
			elapsedTimeString.push(`${seconds} second${seconds > 1 ? "s" : ""}`)
		}
		if (miliseconds > 0) {
			elapsedTimeString.push(`${miliseconds} milisecond${miliseconds > 1 ? "s" : ""}`)
		}

		return elapsedTimeString.join(" ")
	}
}
