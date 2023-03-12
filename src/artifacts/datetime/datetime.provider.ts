/** @format */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

@Injectable()
export class DatetimeProvider {
	public getUtcTime(): Date {
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
		return utcTime
	}

	public isoStringToDatetime(isoString: string): Date {
		const dateParts: string[] = isoString.split(/[- :.]/)
		const dateObject: Date = new Date(
			parseInt(dateParts[0]),
			parseInt(dateParts[1]),
			parseInt(dateParts[2]),
			parseInt(dateParts[3]),
			parseInt(dateParts[4]),
			parseInt(dateParts[5]),
			parseInt(dateParts[6])
		)
		return dateObject
	}

	public getUtcIsoString(): string {
		const utcTime: Date = this.getUtcTime()
		const utcIsoString: string = utcTime.toISOString()
		return utcIsoString
	}

	public prettifyDateTimeObj(dateTimeObj: Date): string {
		const year: number = dateTimeObj.getFullYear()
		const month: number = dateTimeObj.getMonth()
		const day: number = dateTimeObj.getDay()
		const hour: number = dateTimeObj.getHours()
		const minutes: number = dateTimeObj.getMinutes()
		const seconds: number = dateTimeObj.getSeconds()
		const millisecons: number = dateTimeObj.getMilliseconds()
		const prettyDateTime: string = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}.${millisecons}`
		return prettyDateTime
	}
}
