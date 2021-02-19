import Action from '../../services/users/bitcoins/Action'
import { makeServiceRunner } from '../utils'

export default {
  action: makeServiceRunner(Action, req => ({ ...req.body as Record<string, unknown>, ...req.params }))
}
