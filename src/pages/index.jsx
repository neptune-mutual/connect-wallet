import Head from "next/head";
import { useWeb3React } from "@web3-react/core";
import ConnectWallet from "@/lib/connect-wallet/components/ConnectWallet/ConnectWallet";
import { ConnectionDetails } from "@/components/ConnectionDetails/ConnectionDetails";
import { SignMessage } from "@/components/SignMessage/SignMessage";
import { SimpleRW } from "@/components/SimpleRW/SimpleRW";
import { networkId } from "@/src/config/environment";
import { useNotifier } from "@/src/hooks/useNotifier";
import { Button } from "@/components/Button";
import { ChainLogos, NetworkNames } from "@/lib/connect-wallet/config/chains";

export default function Home() {
  const { notifier } = useNotifier();
  const { active } = useWeb3React();

  const ChainLogo = ChainLogos[networkId] || ChainLogos[1];

  const network = (
    <div className="flex items-center mt-6 mr-4 bg-white text-black font-semibold py-3 px-6 border border-d4dfee rounded-xl">
      <ChainLogo width={24} height={24} />{" "}
      <p className="block ml-2">{NetworkNames[networkId]}</p>
    </div>
  );

  return (
    <div>
      <Head>
        <title>Neptune Mutual</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-8">
        <h1 className="text-h2 sm:text-h1 leading-none font-extrabold text-black tracking-tight mb-8">
          Welcome to Neptune Mutual
        </h1>
        <ConnectWallet networkId={networkId} notifier={notifier}>
          {({ onOpen, logout }) => {
            let button = <Button onClick={onOpen}>Connect Wallet</Button>;

            if (active) {
              button = <Button onClick={logout}>Disconnect</Button>;
            }

            return (
              <div className="flex items-center">
                {network} {button}
              </div>
            );
          }}
        </ConnectWallet>
        <ConnectionDetails />
        <SignMessage />
        <SimpleRW />
      </main>
    </div>
  );
}
