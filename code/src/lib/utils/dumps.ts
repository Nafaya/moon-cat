import Bitcoin from '../models/Bitcoin'

import User from '../models/User'

export interface IDumpBitcoinOutput {
    updatedAt: string,
    price: string
}

export function dumpBitcoin(v: Bitcoin): IDumpBitcoinOutput {
    const { price, updatedAt } = v
    return {
        updatedAt: updatedAt.toISOString(),
        price: price.toFixed()
    }
}

export interface IDumpUserOutput {
    id: string,
    name: string,
    username: string,
    email: string,
    bitcoinAmount: string
    usdBalance: string
    createdAt: string,
    updatedAt: string,
}

export function dumpUser({ id, name, username, email, bitcoinAmount, usdBalance, createdAt, updatedAt }: User): IDumpUserOutput {
    return {
        id,
        name,
        username,
        email,
        usdBalance: usdBalance.toFixed(2),
        bitcoinAmount: bitcoinAmount.toFixed(6),
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString()
    }
}
