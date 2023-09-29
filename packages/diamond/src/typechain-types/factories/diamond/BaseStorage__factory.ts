/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  BaseStorage,
  BaseStorageInterface,
} from "../../contracts/diamond/BaseStorage";

const _abi = [
  {
    inputs: [],
    name: "ADMIN_ROLE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "API_ROLE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MANAGER_ROLE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a9610039600b82828239805160001a60731461002c57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060475760003560e01c806311fc806514604c57806375b238fc146065578063ec87621c14606c575b600080fd5b6053600481565b60405190815260200160405180910390f35b6053600181565b605360028156fea2646970667358221220a3e79d6cb793be0c59eddff0225722fd63aca37acb75c5f5c4704af30daef9e264736f6c63430008130033";

type BaseStorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BaseStorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BaseStorage__factory extends ContractFactory {
  constructor(...args: BaseStorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<BaseStorage> {
    return super.deploy(overrides || {}) as Promise<BaseStorage>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): BaseStorage {
    return super.attach(address) as BaseStorage;
  }
  override connect(signer: Signer): BaseStorage__factory {
    return super.connect(signer) as BaseStorage__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BaseStorageInterface {
    return new utils.Interface(_abi) as BaseStorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BaseStorage {
    return new Contract(address, _abi, signerOrProvider) as BaseStorage;
  }
}