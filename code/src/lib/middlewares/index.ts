import bodyParser from 'body-parser'
import cors from 'cors'
import setTraceId from './setTraceId'
import setLogger from './setLogger'
import logRequestBasicInfo from './logRequestBasicInfo'

export default {
  setTraceId,
  setLogger,
  logRequestBasicInfo,
  json: bodyParser.json({
    limit: 1024 * 1024,
    verify: (_req, _res, buf) => {
      try {
        JSON.parse(buf.toString())
      } catch (e) {
        throw new Error('Broken json')
      }
    }
  }),
  text: bodyParser.text({ limit: 1024 * 1024 }),
  urlencoded: bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 }),
  cors: cors({ origin: '*' })
}
