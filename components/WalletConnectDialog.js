import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import CloseIcon from "../public/icons/close-icon.png";
import MetamaskIcon from "../public/icons/metamask-icon.png";
import BinanceIcon from "../public/icons/binance-icon.png";
import WalletConnectIcon from "../public/icons/wallet-connect-icon.png";

import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

const metamask = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
});

export default function WalletConnectDialog() {
    let [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const { account, library, chainId, activate, deactivate, error } = useWeb3React();
    console.log(account)

    //connecting to  a metamsk wallet
    async function connect(id) {
        if (id === 1) {
            try {
                await activate(metamask);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const buttons = [
        {
            id: 1,
            iconName: MetamaskIcon,
            buttonText: "Metamask",
        },
        {
            id: 2,
            iconName: BinanceIcon,
            buttonText: "Binance Chain Wallet",
        },
        {
            id: 3,
            iconName: WalletConnectIcon,
            buttonText: "Wallet Connect",
        },
    ];

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="px-4 py-2 mt-4 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
                Connect Wallet
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-npm-width h-npm-height max-w-md p-12 my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl bg-npm-blue">
                                <div
                                    className="absolute top-7 right-14 cursor-pointer"
                                    onClick={closeModal}
                                >
                                    <Image src={CloseIcon}></Image>
                                </div>
                                <Dialog.Title
                                    as="h3"
                                    className="text-3xl font-bold leading-6 text-black-900 leading-9"
                                >
                                    Connect Wallet
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-base text-black-500 leading-5 mt-6">
                                        By connecting a wallet, you agree to
                                        Neptune Mutual
                                        <Link href="javascript:void(0)">
                                            <a className="text-blue-400">
                                                {" "}
                                                Terms &amp; Conditions{" "}
                                            </a>
                                        </Link>
                                        and acknowledge that you have read and
                                        understand the Neptune Mutual Protocol
                                        Disclaimer.
                                    </p>
                                </div>

                                <div className="mt-8 flex-col h-52">
                                    {buttons.map((button) => (
                                        <button
                                            key={button.id}
                                            onClick={() => connect(button.id)}
                                            type="button"
                                            className="inline-flex w-full text-sm h-14 mb-5 font-normal text-black-900 bg-white border border-transparent rounded-md focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        >
                                            <div className="mx-6 my-4">
                                                <Image src={button.iconName} />
                                            </div>
                                            <p className="py-4 text-base">
                                                {button.buttonText}{" "}
                                            </p>
                                            <span className="text-green-500 absolute pl-4">{button.buttonText === "Metamask" && account ? account: null}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}