import { Address, beginCell, TupleItem, TupleReader } from '@ton/core'
import snakeCase from 'lodash/snakeCase'
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

    return call
  }

  private static getParams(fn: TonFunctionDef, args: any[]): TupleItem[] {
    const params: TupleItem[] = []

    try {
      for (let i = 0; i < fn.inputs.length; i++) {
        const input = fn.inputs[i]
        switch (input.type) {
          case 'address': {
            logger.debug('try store', args[i])
            const address = Address.parse(args[i])
            params.push({
              type: 'slice',
              cell: beginCell().storeAddress(address).endCell(),
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
    } catch (ex) {
      console.error('Error when parse args', ex)
      throw ex
    }
  }

  private async callReadFunction(fn: TonFunctionDef, ...args: any[]) {
    try {
      const client = TonContext.instance.getClient()
      logger.debug('contract address:', this.address, `https://testnet.tonscan.org/address/${this.address}`)
      const contract = Address.parse(this.address)
      const methodName = snakeCase(fn.method)
      logger.debug('--call function--', methodName, 'with params', args)
      const params = ContractProxy.getParams(fn, args)
      const result = await client.runMethod(contract, methodName, params)
      const resolvedResult = recoverResults(fn, result.stack)
      logger.debug('result', resolvedResult)
      return resolvedResult
    } catch (ex) {
      console.error(`Error when calling ${fn.method} with args ${args}`)
      throw ex
    }
  }
}

function recoverResults(fn: TonFunctionDef, stack: TupleReader): any[] {
  const res: any[] = []
  for (let i = 0; i < fn.outputs.length; i++) {
    const output = fn.outputs[i]
    switch (output.type) {
      case 'address': {
        const address = stack.readAddress()
        res.push(address.toString())
        break
      }
      case 'int': {
        const val = stack.readBigNumber()
        res.push(val)
        break
      }
      default:
        throw new Error(`Not support type ${output.type}`)
    }
  }
  return res.length === 1 ? res[0] : res
}
