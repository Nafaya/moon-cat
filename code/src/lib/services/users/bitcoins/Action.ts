/* eslint-disable @typescript-eslint/require-await */
import ServiceBase from '../../Base'
import Joi from 'joi'
import User from '../../../models/User'
import { dumpUser, IDumpUserOutput } from '../../../utils/dumps'
import { ValidationError, NotFoundError } from '../../../utils/X'

import GetUserService, { IGetUserServiceInput } from '../Get'
import DX from '../../../models/utils/DX'

type IMakeUserBitcoinsActionServiceInput = IGetUserServiceInput & {
    action: 'buy' | 'sell'
    amount: number
}
export default class MakeUserBitcoinsActionService extends ServiceBase {
    static validationSchema = Joi.any()
        .concat(GetUserService.validationSchema)
        .concat(Joi.object({
            action: Joi.string().valid('buy', 'sell').required(),
            amount: Joi.number().positive().precision(2)
        }));

    validate(params : unknown): IMakeUserBitcoinsActionServiceInput {
        const result = MakeUserBitcoinsActionService.validationSchema.validate(params)

        if (result.error) throw result.error

        return result.value as IMakeUserBitcoinsActionServiceInput
    }

    async execute({ id, action, amount } : IMakeUserBitcoinsActionServiceInput): Promise<IDumpUserOutput> {
        const user = await User.findOne({
            indexName: 'unique-constraint-id',
            item: { id }
        })
        if (!user) throw new NotFoundError(`Cannot find user with id ${id}`)

        if (action === 'buy') await user.buyBitcoins(amount)
        else if (action === 'sell') await user.sellBitcoins(amount)

        return dumpUser(user)
    }

    translateError(e : Error) : never {
        this.logger.error(e)
        if (e instanceof Joi.ValidationError) {
            throw new ValidationError(e.message)
        } else if ((e instanceof DX) && e.message === 'Insufficient usb amount') {
            throw new ValidationError(e.message)
        } else if ((e instanceof DX) && e.message === 'You cannot sell more bitcoins than you have') {
            throw new ValidationError(e.message)
        }
        throw e
    }
}
