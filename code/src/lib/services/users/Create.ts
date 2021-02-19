/* eslint-disable @typescript-eslint/require-await */
import ServiceBase from '../Base'
import Joi from 'joi'
import User from '../../models/User'
import { dumpUser, IDumpUserOutput } from '../../utils/dumps'
import { ValidationError } from '../../utils/X'

export interface ICreateUserServiceInput { name: string, username: string, email: string };

export default class CreateUserService extends ServiceBase {
    static validationSchema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().alphanum().min(6).max(30).required(),
        email: Joi.string().email().required()
    });

    validate(params : unknown): ICreateUserServiceInput {
        const result = CreateUserService.validationSchema.validate(params)

        if (result.error) throw result.error

        return result.value as ICreateUserServiceInput
    }

    async execute(params : ICreateUserServiceInput): Promise<IDumpUserOutput> {
        const user = await User.create(params)
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
