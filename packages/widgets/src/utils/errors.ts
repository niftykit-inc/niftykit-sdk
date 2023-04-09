import {
  EthereumRpcError,
  getMessageFromCode,
  errorCodes,
} from 'eth-rpc-errors';

const USER_REJECTED_CODES = [
  errorCodes.provider.userRejectedRequest,
  'ACTION_REJECTED',
];

const UNAUTHORIZED_CODE = '0x82b42900';

export const handleError = (e: EthereumRpcError<unknown>): string => {
  let error = e;

  if (e.code === errorCodes.rpc.internal) {
    error = (e.data as EthereumRpcError<unknown>) || e;
  }

  const msg =
    typeof error === 'string'
      ? error
      : error?.message ||
        getMessageFromCode(error?.code, 'Something went wrong');

  if (
    msg.includes('insufficient funds') ||
    msg.includes('ERC20: transfer amount exceeds balance')
  ) {
    return "You don't have enough balance in your wallet to cover the cost of this transaction.";
  }

  if (msg.includes(UNAUTHORIZED_CODE)) {
    return 'Unauthorized access. Please connect to the correct wallet or contact us for support.';
  }

  if (USER_REJECTED_CODES.includes(error?.code as any)) {
    return 'User denied transaction signature.';
  }

  const regex = /("(message)":|reason=)("([^""]+)"|\[[^[]+])/;
  const errors = msg.match(regex);
  return errors?.length ? errors[errors.length - 1] : msg;
};
