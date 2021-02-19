import Storage from '../utils/Storage'
import * as dot from 'ts-dot-prop'

export interface IModelOptions {
    isNewRecord?: boolean
}

export default class Base<T extends Record<never, unknown>> {
    protected record : T | null = null
    protected pendingPecord : T | null = null

    protected constructor(record : T, options: IModelOptions, protected storage: Storage<T>) {
        if (options.isNewRecord ?? options.isNewRecord === undefined) {
            this.pendingPecord = record
        } else this.record = record

        // Object
        // keys<Props>();
    }

    async save(): Promise<void> {
        if (this.pendingPecord === null) return
        if (this.record) await this.storage.delete(this.record)
        this.record = await this.storage.create({ ...this.record as T, ...this.pendingPecord })
        this.pendingPecord = null
    }

    set(record : T): void {
        this.pendingPecord = { ...this.pendingPecord, ...record }
    }

    setDataValue(property : string, value: unknown): void {
        this.pendingPecord = this.pendingPecord ?? ({} as unknown as T)
        return dot.set(this.pendingPecord, property, value)
    }

    getDataValue(property : string): unknown {
        return dot.get(this.pendingPecord ?? {}, property) ?? dot.get(this.record ?? {}, property)
    }

    async update(record : T): Promise<void> {
        this.set(record)
        return await this.save()
    }
}
