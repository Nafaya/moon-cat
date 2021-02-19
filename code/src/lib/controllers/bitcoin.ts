import Get from '../services/bitcoin/Get'
import Put from '../services/bitcoin/Put'
import { makeServiceRunner } from './utils'

export default {
  put: makeServiceRunner(Put, req => ({ ...req.body as Record<string, unknown> })),
  get: makeServiceRunner(Get, req => ({ ...req.params }))
}
