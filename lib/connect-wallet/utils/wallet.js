import { ConnectorNames } from "../config/connectors";
import { chains } from "../config/chains";

/**
 *
 * @param {number} networkId
 * @returns
 */
const getNetworkParams = (networkId) => {
  const { id, ...params } = chains.find((x) => x.id === networkId);

  return params;
};

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export const setupNetwork = async (connectorName) => {
  const networkId = parseInt(CHAIN_ID, 10);

  switch (connectorName) {
    case ConnectorNames.Injected:
    default: {
      // @ts-ignore
      const provider = window.ethereum;

      if (!provider) {
        console.error("Can't setup network - window.ethereum is undefined");
        return false;
      }

      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [getNetworkParams(networkId)],
        });

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage
) => {
  const tokenAdded = await window.ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  });

  return tokenAdded;
};