/* eslint-disable @typescript-eslint/require-await */
import ServiceBase from '../Base'
import Joi from 'joi'
import Bitcoin from '../../models/Bitcoin'
import { dumpBitcoin, IDumpBitcoinOutput } from '../../utils/dumps'
import DX from '../../models/utils/DX'
import { ValidationError } from '../../utils/X'

export interface IPutBitcoinServiceInput { price: number };

export default class PutBitcoinService extends ServiceBase {
    static validationSchema = Joi.object({
        price: Joi.number().positive()
    });

    validate(params : unknown): IPutBitcoinServiceInput {
        const result = PutBitcoinService.validationSchema.validate(params)

        if (result.error) throw result.error

        return result.value as IPutBitcoinServiceInput
    }

    async execute(params : IPutBitcoinServiceInput): Promise<IDumpBitcoinOutput> {
        const bitcoin = await Bitcoin.findOne()
        if (!bitcoin) throw new Error('!bitcoin')
        await bitcoin.update(params)
        return dumpBitcoin(bitcoin)
    }

    translateError(e : Error) : never {
        this.logger.error(e)
        if (e instanceof Joi.ValidationError) {
            throw new ValidationError(e.message)
        } else if ((e instanceof DX) && e.message === 'Invalid price parameter') {
            throw new ValidationError('Invalid price')
        }
        throw e
    }
}
