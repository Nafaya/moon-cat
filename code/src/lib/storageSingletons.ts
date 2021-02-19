import Storage from './utils/Storage'
import { IBitcoin } from './models/Bitcoin'
import { IUser } from './models/User'

export const Bitcoins = new Storage<IBitcoin>()
export const Users = new Storage<IUser>({
    indexes: [
        { name: 'unique-constraint-id', fields: ['id'] },
        { name: 'unique-constraint-email', fields: ['email'] },
        { name: 'unique-constraint-username', fields: ['username'] }
    ]
})
