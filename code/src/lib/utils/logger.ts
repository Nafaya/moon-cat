import 'colors'
import { createLogger, format, transports, Logger } from 'winston'
import { TransformableInfo } from 'logform'

const { combine, timestamp, printf } = format

type IExtendedTransformableInfo = TransformableInfo & { timestamp: string, stack?: string }

let maxTitleLength = 0

export function create(title = '') : Logger {
    maxTitleLength = Math.max(maxTitleLength, title.length)
    return createLogger({
        format: combine(
            timestamp(),
            printf(
                (
                    (info: IExtendedTransformableInfo) => {
                        return `${info.timestamp} [${title.green.padEnd(maxTitleLength)}]: ${info.message} ${info.stack ? `\r\n${info.stack}` : ''}`
                    }
                ) as ((info : TransformableInfo) => string)
            )
        ),
        transports: [new transports.Console()]
    })
}

const defaultLogger = create('')

export default defaultLogger
