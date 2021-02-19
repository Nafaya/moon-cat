import 'bluebird-global'
import { Server } from 'http'
import app from './app'
import { create as createLogger } from './lib/utils/logger'
import { Bitcoins, Users } from './lib/storageSingletons'
import Bitcoin from './lib/models/Bitcoin'

const logger = createLogger('App')
let server : null | Server = null

shutup().catch(e => {
    console.error(e)
    process.exit(1)
})

async function shutup(): Promise<void> {
    for (const storage of [Bitcoins, Users]) await storage.init()

    logger.info(`Initializing datebase`)
    await Bitcoin.create({ price: 100 })
    await Bitcoin.findOne()

    await Promise.fromCallback(cb => {
        const PORT = process.env.APP_PORT ?? 3000

        server = app.listen(PORT, function () {
            logger.info(`App is listening at ${PORT}`)
            cb(null)
        })
    })
}

async function shutdown(): Promise<void> {
    try {
        logger.info('Closing server')
        await Promise.fromCallback(cb => { server?.close(cb) ?? cb(null) })

        logger.info('Exit')
        process.exit(0)
    } catch(e) {
        logger.error(e)
        process.exit(1)
    }
}

// Subscribe to system signals
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal catched')

    shutdown().catch(console.error)
})

process.on('SIGINT', () => {
    logger.info('SIGINT signal catched')

    shutdown().catch(console.error)
})
