import Base, { IModelOptions } from './Base'
import { Bitcoins as BitcoinsStorage } from '../storageSingletons'
import DX from './utils/DX'

export interface IBitcoin {
    updatedAt? : Date
    price? : number
}

export default class Bitcoin extends Base<IBitcoin> {
    protected constructor(record : Partial<IBitcoin> = {}, options: IModelOptions = {}) {
        if (options.isNewRecord) {
            if (record.updatedAt === undefined) record.updatedAt = new Date()
        }
        super(record, options, BitcoinsStorage)
    }

    get price(): number {
        return this.getDataValue('price') as number
    }

    set price(value : number) {
        this.setDataValue('price', value)
    }

    get updatedAt(): Date {
        return this.getDataValue('updatedAt') as Date
    }

    set updatedAt(value : Date) {
        this.setDataValue('updatedAt', value)
    }

    validate(): void {
        if (this.price <= 0) throw new DX('Invalid price parameter')
    }

    async save(): Promise<void> {
        this.validate()
        if (this.pendingPecord === null) return
        this.pendingPecord.updatedAt = new Date()
        return await super.save()
    }

    static build(params: IBitcoin | undefined) : Bitcoin {
        return new Bitcoin(params)
    }

    static async create(params: IBitcoin | undefined) : Promise<Bitcoin> {
        const bitcoin = new Bitcoin(params, { isNewRecord: true })
        await bitcoin.save()
        return bitcoin
    }

    static async findOne(params?: { item?: Partial<IBitcoin> | undefined; limit?: number | undefined; offset?: number | undefined; indexName?: string | undefined; filter?: ((x: IBitcoin) => boolean | Promise<boolean>) | undefined } | undefined) : Promise<Bitcoin | undefined> {
        const record = await BitcoinsStorage.findOne(params)

        return record && new Bitcoin(record, { isNewRecord: false })
    }

    static async findAll(params?: { item?: Partial<IBitcoin> | undefined; indexName?: string | undefined; limit?: number | undefined; offset?: number | undefined; filter?: ((x: IBitcoin) => boolean | Promise<boolean>) | undefined } | undefined) : Promise<Bitcoin[]> {
        return (await BitcoinsStorage.findAll(params)).map(record => new Bitcoin(record, { isNewRecord: false }))
    }
}
