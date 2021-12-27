import { useCallback, useEffect } from "react";

import { CHAIN_ID } from "@/src/config/environment";
import { ACTIVE_CONNECTOR_KEY } from "@/lib/connect-wallet/config/localstorage";

import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { getConnectorByName } from "@/lib/connect-wallet/utils/connectors";
import { wallets } from "@/lib/connect-wallet/config/wallets";
import { NetworkNames } from "@/lib/connect-wallet/config/chains";
import { setupNetwork } from "@/lib/connect-wallet/utils/wallet";
import { ConnectorNames } from "@/lib/connect-wallet/config/connectors";

const activateConnector = async (connectorName, activate) => {
  const networkId = parseInt(CHAIN_ID, 10);

  const connector = await getConnectorByName(connectorName, networkId);

  if (!connector) {
    console.error(
      "Unable to find connector: Could not identify from local storage"
    );
    return;
  }

  window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, connectorName);

  activate(connector, async (error) => {
    if (error instanceof UnsupportedChainIdError) {
      const hasSetup = await setupNetwork(connectorName, networkId);

      if (hasSetup) {
        activate(connector, () => {
          window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY);
        });
        return;
      }

      window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY);

      const wallet = wallets.find(
        (wallet) => wallet.connectorName === connectorName
      );

      console.error(error);

      console.log("error", {
        title: "Wrong network",
        message: `Please switch to <strong>${NetworkNames[networkId]}</strong> in your <strong>${wallet}</strong> wallet`,
      });
    } else {
      window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY);

      if (connectorName === ConnectorNames.Injected) {
        const { NoEthereumProviderError, UserRejectedRequestErrorInjected } =
          await import("@/lib/connect-wallet/injected/errors");

        if (error instanceof NoEthereumProviderError) {
          console.log("error", {
            title: "Provider Error",
            message: "Could not connect. No provider found",
          });
          return;
        }

        if (error instanceof UserRejectedRequestErrorInjected) {
          console.log("error", {
            title: "Authorization Error",
            message: "Please authorize to access your account",
          });
          return;
        }
      }

      if (connectorName === ConnectorNames.WalletConnect) {
        const {
          UserRejectedRequestErrorWalletConnect,
          WalletConnectConnector,
        } = await import("@/lib/connect-wallet/walletconnect/errors");

        if (error instanceof UserRejectedRequestErrorWalletConnect) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector;
            walletConnector.walletConnectProvider = null;
          }
          console.log("error", {
            title: "Authorization Error",
            message: "Please authorize to access your account",
          });
          return;
        }
      }

      if (connectorName === ConnectorNames.BSC) {
        const { NoBscProviderError } = await import(
          "@/lib/connect-wallet/binance-wallet/errors"
        );

        if (error instanceof NoBscProviderError) {
          console.log("error", {
            title: "Provider Error",
            message: "Could not connect. No provider found",
          });
          return;
        }
      }
    }
    console.error(error);
  });
};

const deactivateConnector = async (deactivate) => {
  const networkId = parseInt(CHAIN_ID, 10);

  deactivate();
  window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY);

  // This localStorage key is set by @web3-react/walletconnect-connector
  if (window.localStorage.getItem("walletconnect")) {
    const connector = await getConnectorByName(
      ConnectorNames.WalletConnect,
      networkId
    );
    connector.close();
    connector.walletConnectProvider = null;
  }
};

const useAuth = () => {
  const { activate, deactivate, chainId, library } = useWeb3React();

  useEffect(() => {
    if (!library) {
      return;
    }

    const handleDisconnect = () => deactivateConnector(deactivate);

    // Registering events
    library.provider.on("disconnect", handleDisconnect);
    return () => {
      // Unegistering events
      library.provider.removeListener("disconnect", handleDisconnect);
    };
  }, [deactivate, library]);

  const login = useCallback(
    (connectorName) => activateConnector(connectorName, activate),
    [activate]
  );

  const logout = useCallback(
    () => deactivateConnector(deactivate),
    [deactivate]
  );

  return { logout, login };
};

export default useAuth;
