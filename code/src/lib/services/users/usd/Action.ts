/* eslint-disable @typescript-eslint/require-await */
import ServiceBase from '../../Base'
import Joi from 'joi'
import User from '../../../models/User'
import { dumpUser, IDumpUserOutput } from '../../../utils/dumps'
import { ValidationError, NotFoundError } from '../../../utils/X'

import GetUserService, { IGetUserServiceInput } from '../Get'
import DX from '../../../models/utils/DX'

type IMakeUserUsdActionServiceInput = IGetUserServiceInput & {
    action: 'withdraw' | 'deposit'
    amount: number
}
export default class MakeUserUsdActionService extends ServiceBase {
    static validationSchema = Joi.any()
        .concat(GetUserService.validationSchema)
        .concat(Joi.object({
            action: Joi.string().valid('withdraw', 'deposit').required(),
            amount: Joi.number().positive().precision(2)
        }));

    validate(params : unknown): IMakeUserUsdActionServiceInput {
        const result = MakeUserUsdActionService.validationSchema.validate(params)

        if (result.error) throw result.error

        return result.value as IMakeUserUsdActionServiceInput
    }

    async execute({ id, action, amount } : IMakeUserUsdActionServiceInput): Promise<IDumpUserOutput> {
        const user = await User.findOne({
            indexName: 'unique-constraint-id',
            item: { id }
        })
        if (!user) throw new NotFoundError(`Cannot find user with id ${id}`)

        if (action === 'withdraw') await user.withdrawUsd(amount)
        else if (action === 'deposit') await user.depositUsd(amount)

        return dumpUser(user)
    }

    translateError(e : Error) : never {
        this.logger.error(e)
        if (e instanceof Joi.ValidationError) {
            throw new ValidationError(e.message)
        } else if ((e instanceof DX) && e.message === 'Insufficient usb amount') {
            throw new ValidationError(e.message)
        }
        throw e
    }
}
