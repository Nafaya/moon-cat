import Base, { IModelOptions } from './Base'
import { Users as UsersStorage } from '../storageSingletons'
import { v4 } from 'uuid'
import Bitcoin from './Bitcoin'
import DX from './utils/DX'

export interface IUser {
    id? : string
    name? : string
    username? : string
    email? : string
    bitcoinAmount? : number
    usdBalance? : number
    createdAt? : Date
    updatedAt? : Date
}

export default class User extends Base<IUser> {
    protected constructor(record : Partial<IUser> = {}, options: IModelOptions = {}) {
        if (options.isNewRecord) {
            if (record.id === undefined) record.id = v4()
            if (record.bitcoinAmount === undefined) record.bitcoinAmount = 0
            if (record.usdBalance === undefined) record.usdBalance = 0
            if (record.createdAt === undefined) record.createdAt = new Date()
            if (record.updatedAt === undefined) record.updatedAt = new Date()
        }
        super(record, options, UsersStorage)
    }

    get id(): string {
        return this.getDataValue('id') as string
    }

    set id(value : string) {
        this.setDataValue('id', value)
    }

    get name(): string {
        return this.getDataValue('name') as string
    }

    set name(value : string) {
        this.setDataValue('name', value)
    }

    get username(): string {
        return this.getDataValue('username') as string
    }

    set username(value : string) {
        this.setDataValue('username', value)
    }

    get email(): string {
        return this.getDataValue('email') as string
    }

    set email(value : string) {
        this.setDataValue('email', value)
    }

    get bitcoinAmount(): number {
        return this.getDataValue('bitcoinAmount') as number
    }

    set bitcoinAmount(value : number) {
        this.setDataValue('bitcoinAmount', value)
    }

    get usdBalance(): number {
        return this.getDataValue('usdBalance') as number
    }

    set usdBalance(value : number) {
        this.setDataValue('usdBalance', value)
    }

    get createdAt(): Date {
        return this.getDataValue('createdAt') as Date
    }

    set createdAt(value : Date) {
        this.setDataValue('createdAt', value)
    }

    get updatedAt(): Date {
        return this.getDataValue('updatedAt') as Date
    }

    set updatedAt(value : Date) {
        this.setDataValue('updatedAt', value)
    }

    async calculateTotalAmount() : Promise<number> {
        const bitcoin = await Bitcoin.findOne()
        if (!bitcoin) throw new Error('!bitcoin')

        return this.usdBalance + this.bitcoinAmount * bitcoin.price
    }

    async withdrawUsd(amount : number) : Promise<void> {
        if (this.usdBalance - amount < 0) throw new DX('Insufficient usb amount')
        this.usdBalance -= amount
        await this.save()
    }

    async depositUsd(amount : number) : Promise<void> {
        this.usdBalance += amount
        await this.save()
    }

    async buyBitcoins(amount : number) : Promise<void> {
        const bitcoin = await Bitcoin.findOne()
        if (!bitcoin) throw new Error('!bitcoin')

        if (this.usdBalance - bitcoin.price * amount < 0) throw new DX('Insufficient usb amount')
        this.usdBalance -= bitcoin.price * amount
        this.bitcoinAmount += amount
        await this.save()
    }

    async sellBitcoins(amount: number) : Promise<void> {
        const bitcoin = await Bitcoin.findOne()
        if (!bitcoin) throw new Error('!bitcoin')

        if (this.bitcoinAmount - amount < 0) throw new DX('You cannot sell more bitcoins than you have')
        this.usdBalance += bitcoin.price * amount
        this.bitcoinAmount -= amount
        await this.save()
    }

    validate(): void {
        if (this.usdBalance < 0 || this.usdBalance < 0) throw new DX('Invalid parameters')
    }

    async save(): Promise<void> {
        this.validate()
        if (this.pendingPecord === null) return
        this.pendingPecord.updatedAt = new Date()
        return await super.save()
    }

    static build(params: IUser | undefined) : User {
        return new User(params, { isNewRecord: true })
    }

    static async create(params: IUser | undefined) : Promise<User> {
        const user = new User(params, { isNewRecord: true })
        await user.save()
        return user
    }

    static async findOne(params?: { item?: Partial<IUser> | undefined; limit?: number | undefined; offset?: number | undefined; indexName?: string | undefined; filter?: ((x: IUser) => boolean | Promise<boolean>) | undefined } | undefined) : Promise<User | undefined> {
        const record = await UsersStorage.findOne(params)

        return record && new User(record, { isNewRecord: false })
    }

    static async findAll(params?: { item?: Partial<IUser> | undefined; indexName?: string | undefined; limit?: number | undefined; offset?: number | undefined; filter?: ((x: IUser) => boolean | Promise<boolean>) | undefined } | undefined) : Promise<User[]> {
        return (await UsersStorage.findAll(params)).map(record => new User(record, { isNewRecord: false }))
    }
}
