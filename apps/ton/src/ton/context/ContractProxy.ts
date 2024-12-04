import { Address, beginCell, TupleItem } from '@ton/core'
import { ContractClasses } from 'ton/def/contractClass.def'
import { TonContractTypes } from 'ton/ton.enums'
import { TonFunctionDef } from 'ton/ton.types'
import { Logger } from 'ton/utils/Logger'
import { TonContext } from './TonContext'

const logger = Logger.getLogger('ContractProxy')
export class ContractProxy {
  constructor(private type: TonContractTypes, private address: string) {}

  private findFuncDef(name: string): TonFunctionDef | undefined {
    const contractDef = ContractClasses[this.type]
    const interfaces = contractDef.interfaces
    return interfaces.find((x: TonFunctionDef) => x.method === name)
  }

  get(_: any, prop: string) {
    if (prop === 'then') {
      return undefined
    }
    logger.debug('run get', prop)

    const fn = this.findFuncDef(prop)

    if (!fn) {
      return undefined
    }

    // TODO: For write function
    const call = async (...args: any[]) => {
      return this.callReadFunction(fn, ...args)
    }
    logger.debug('fn', call)

    return call
  }

  private static getParams(fn: TonFunctionDef, args: any[]): TupleItem[] {
    const params: TupleItem[] = []

    for (let i = 0; i < fn.inputs.length; i++) {
      const input = fn.inputs[i]
      switch (input.type) {
        case 'address': {
          logger.debug('try store', args[i])
          params.push({
            type: 'slice',
            cell: beginCell().storeAddress(args[i]).endCell(),
          })
          break
        }
        case 'int':
          params.push({
            type: 'int',
            value: args[i],
          })
          break
        default:
          throw new Error(`Not support type ${input.type}`)
      }
    }
    return params
  }

  private async callReadFunction(fn: TonFunctionDef, ...args: any[]) {
    try {
      const client = TonContext.instance.getClient()
      const contract = Address.parse(this.address)
      logger.debug('call function', fn.method, 'with params')
      const params = ContractProxy.getParams(fn, args)
      console.log(params)
      const result = await client.runMethod(contract, fn.method, params)
      logger.debug('result', result)
      return result
    } catch (ex) {
      console.error(`Error when calling ${fn.method} with args ${args}`)
      // @ts-ignore
      const msg = ex?.message
      if (msg) {
        console.error(msg)
      } else {
        console.error(ex)
      }
      throw ex
    }
  }
}
