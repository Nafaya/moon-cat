/* eslint-disable @typescript-eslint/require-await */
import ServiceBase from '../Base'
import Joi from 'joi'
import User from '../../models/User'
import { dumpUser, IDumpUserOutput } from '../../utils/dumps'
import { ValidationError, NotFoundError } from '../../utils/X'

export interface IGetUserServiceInput { id: string };

export default class GetUserServiceService extends ServiceBase {
    static validationSchema = Joi.object({
        id: Joi.string().required()
    });

    validate(params : unknown): IGetUserServiceInput {
        const result = GetUserServiceService.validationSchema.validate(params)

        if (result.error) throw result.error

        return result.value as IGetUserServiceInput
    }

    async execute({ id } : IGetUserServiceInput): Promise<IDumpUserOutput> {
        const user = await User.findOne({
            indexName: 'unique-constraint-id',
            item: { id }
        })
        if (!user) throw new NotFoundError(`Cannot find user with id ${id}`)
        return dumpUser(user)
    }

    translateError(e : Error) : never {
        this.logger.error(e)
        if (e instanceof Joi.ValidationError) {
            throw new ValidationError(e.message)
        }
        throw e
    }
}
