import Create from '../../services/users/Create'
import Get from '../../services/users/Get'
import Put from '../../services/users/Put'
import { makeServiceRunner } from '../utils'

import balance from './balance'
import bitcoins from './bitcoins'
import usd from './usd'

export default {
  create: makeServiceRunner(Create, req => ({ ...req.body as Record<string, unknown> })),
  get: makeServiceRunner(Get, req => ({ ...req.params })),
  put: makeServiceRunner(Put, req => ({ ...req.body as Record<string, unknown>, ...req.params })),
  balance,
  bitcoins,
  usd
}
