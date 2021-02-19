/* eslint-disable @typescript-eslint/require-await */
import * as dot from 'ts-dot-prop'

export interface IStorageIndexDesciption {
    name? : string,
    fields : string[],
    unique? : boolean
}
export interface IStorageSchema {
    indexes? : IStorageIndexDesciption[]
}

export function getIndexKey<T extends Record<never, unknown>>(v:T, fields: string[]): string {
    return JSON.stringify(fields.map(k => dot.get(v, k) as unknown))
}

export default class Storage<T extends Record<never, unknown>> {
    private readonly set = new Set<T>()
    private readonly indexesDesciptions = new Map<string, Required<IStorageIndexDesciption>>()
    private readonly indexes = new Map<string, Map<string, Set<T>>>()

    constructor(private readonly schema : IStorageSchema = {}) {
    }

    async init() : Promise<void> {
        if (this.schema.indexes) {
            for (const index of this.schema.indexes) await this.addIndex(index)
        }
    }

    async addIndex({ name, fields, unique = true } : IStorageIndexDesciption) : Promise<void> {
        if (!name) name = `${unique ? 'unique-' : ''}${fields.join('_')}`
        if (this.indexes.has(name)) throw new Error(`Index ${name} already exists`)

        this.indexesDesciptions.set(name, { name, fields, unique })
        this.indexes.set(name, new Map())
        await this.recalculateIndex(name)
    }

    private async recalculateIndex(name: string) : Promise<void> {
        const index = this.indexesDesciptions.get(name)

        if (!index) throw new Error('!index')

        const map = new Map<string, Set<T>>()

        for (const v of this.set) {
            const key = getIndexKey(v, index.fields)
            if (map.has(key)) {
                if (index.unique) throw new Error(`Unique constraint violated. ${name}`)
                else map.get(key)?.add(v)
            } else map.set(key, new Set([v]))
        }
    }

    // async set() {

    // }

    // async get() {

    // }

    async create(v: T) : Promise<T> {
        const applies = []
        for (const { unique, fields, name } of this.indexesDesciptions.values()) {
            const key = getIndexKey(v, fields)
            const map = this.indexes.get(name)
            if (!map) throw new Error('!map')
            if (unique && map.has(key)) throw new Error(`Unique constraint violated. ${name}`)
            applies.push(() => {
                if (map.has(key)) {
                    if (unique) throw new Error(`Unique constraint violated. ${name}`)
                    else map.get(key)?.add(v)
                } else map.set(key, new Set([v]))
            })
        }
        this.set.add(v)
        for (const apply of applies) apply()
        return v
    }

    async delete(v: T) : Promise<void> {
        if (!this.set.has(v)) throw new Error('Cannot find an item')

        this.set.delete(v)
        for (const { fields, name } of this.indexesDesciptions.values()) {
            const key = getIndexKey(v, fields)
            const map = this.indexes.get(name)
            if (!map) throw new Error('!map')
            const set = map.get(key)
            if (!set || !set.has(v)) continue
            set.delete(v)

            if (!set.size) map.delete(key)
        }
    }

    async findOne(params?: { item?: Partial<T>, limit?: number, offset?: number, indexName?:string, filter? : (x: T) => boolean | Promise<boolean> }) : Promise<T | undefined> {
        return (await this.findAll({ ...params, limit: 1 }))[0] || null
    }

    async findAll({
        indexName, item, filter, limit = Infinity, offset = 0
    }: { item?: Partial<T>, indexName?:string, limit?: number, offset? :number, filter? : (x: T) => boolean | Promise<boolean> } = {}) : Promise<T[]> {
        let set = null
        if (indexName) {
            const map = this.indexes.get(indexName)
            const fields = this.indexesDesciptions.get(indexName)?.fields
            if (!item) throw new Error(`item is required when using index`)
            if (!map || !fields) throw new Error(`Cannot find index ${indexName}`)
            const key = getIndexKey(item, fields)
            set = map.get(key)
        } else set = this.set

        if (!set) return [] // we have no keys

        if (!filter) return [...set]
        let result = null
        if (filter) {
            result = []
            for (const v of set) {
                if (await filter(v)) {
                    result.push(v)
                    if (result.length >= limit + offset) break
                }
            }
        } else result = []

        return result.slice(offset, limit + offset)
    }
}
