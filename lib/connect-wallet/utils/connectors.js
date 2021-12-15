import { ConnectorNames } from "@/lib/connect-wallet/config/connectors";
import { getConnector as getInjectedConnector } from "@/lib/connect-wallet/injected/connector";

/**
 *
 * @param {string} name
 * @param {number} chainId
 */
export const getConnectorByName = (name, chainId) => {
  switch (name) {
    case ConnectorNames.Injected:
      return getInjectedConnector(chainId);

    default:
      return null;
  }
};