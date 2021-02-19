import BalanceGet from '../../services/users/balance/Get'
import { makeServiceRunner } from '../utils'

export default {
  get: makeServiceRunner(BalanceGet, req => ({ ...req.params }))
}
