import Action from '../../services/users/usd/Action'
import { makeServiceRunner } from '../utils'

export default {
  action: makeServiceRunner(Action, req => ({ ...req.body as Record<string, unknown>, ...req.params }))
}
