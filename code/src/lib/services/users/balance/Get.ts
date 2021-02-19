/* eslint-disable @typescript-eslint/require-await */
import ServiceBase from '../../Base'
import User from '../../../models/User'
import Joi from 'joi'
import { ValidationError, NotFoundError } from '../../../utils/X'

import GetUserService, { IGetUserServiceInput as IGetUserBalanceServiceInput } from '../Get'

export default class GetUserBalanceService extends ServiceBase {
    static validationSchema = GetUserService.validationSchema;

    validate(params : unknown): IGetUserBalanceServiceInput {
        const result = GetUserBalanceService.validationSchema.validate(params)

        if (result.error) throw result.error

        return result.value as IGetUserBalanceServiceInput
    }

    async execute({ id } : IGetUserBalanceServiceInput): Promise<{ amount: string }> {
        const user = await User.findOne({
            indexName: 'unique-constraint-id',
            item: { id }
        })
        if (!user) throw new NotFoundError(`Cannot find user with id ${id}`)

        return {
            amount: (await user.calculateTotalAmount()).toFixed(2)
        }
    }

    translateError(e : Error) : never {
        this.logger.error(e)
        if (e instanceof Joi.ValidationError) {
            throw new ValidationError(e.message)
        }
        throw e
    }
}
