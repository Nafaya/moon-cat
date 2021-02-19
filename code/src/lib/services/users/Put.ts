/* eslint-disable @typescript-eslint/require-await */
import ServiceBase from '../Base'
import Joi from 'joi'
import User from '../../models/User'
import { dumpUser, IDumpUserOutput } from '../../utils/dumps'
import { ValidationError, NotFoundError } from '../../utils/X'

import GetUserService, { IGetUserServiceInput } from './Get'
import CreateUserService, { ICreateUserServiceInput } from './Create'

type IPutUserServiceInput = IGetUserServiceInput & ICreateUserServiceInput;

export default class PutUserService extends ServiceBase {
    static validationSchema = Joi.any()
        .concat(GetUserService.validationSchema)
        .concat(CreateUserService.validationSchema)

    validate(params : unknown): IPutUserServiceInput {
        const result = PutUserService.validationSchema.validate(params)

        if (result.error) throw result.error

        return result.value as IPutUserServiceInput
    }

    async execute({ id, ...params } : IPutUserServiceInput): Promise<IDumpUserOutput> {
        const user = await User.findOne({
            indexName: 'unique-constraint-id',
            item: { id }
        })
        if (!user) throw new NotFoundError(`Cannot find user with id ${id}`)
        await user.update(params)
        return dumpUser(user)
    }

    translateError(e : Error) : never {
        this.logger.error(e)
        if (e instanceof Joi.ValidationError) {
            throw new ValidationError(e.message)
        } else if (e.message === 'Unique constraint violated. unique-constraint-email') {
            throw new ValidationError('User with provided email is already registered')
        } else if (e.message === 'Unique constraint violated. unique-constraint-username') {
            throw new ValidationError('User with provided username is already registered')
        }
        throw e
    }
}
