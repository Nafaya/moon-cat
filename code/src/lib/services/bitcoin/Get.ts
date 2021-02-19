import ServiceBase from '../Base'
import Bitcoin from '../../models/Bitcoin'
import { dumpBitcoin, IDumpBitcoinOutput } from '../../utils/dumps'

export default class GetBitcoinService extends ServiceBase {
    async execute(): Promise<IDumpBitcoinOutput> {
        const bitcoin = await Bitcoin.findOne()
        if (!bitcoin) throw new Error('!bitcoin')
        return dumpBitcoin(bitcoin)
    }
}
