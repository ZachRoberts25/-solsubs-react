import { FC, useState } from "react";
import { web3 } from "@coral-xyz/anchor";
import { createSubscription, useProvider } from "./util";
import { WalletContextState } from "@solana/wallet-adapter-react";

export interface SubscribeButtonProps {
  className?: string;
  text?: string;
  url: string;
  planCode: string;
  planCreatorAddress: web3.PublicKey;
  wallet: WalletContextState;
  onCreate: () => Promise<void>;
  disabled?: boolean;
}

export const SubscribeButton: FC<SubscribeButtonProps> = ({
  className,
  text,
  planCode,
  planCreatorAddress,
  url,
  onCreate,
  wallet,
  disabled,
}) => {
  const [loading, setLoading] = useState(false);
  const provider = useProvider(wallet, url);

  return (
    <button
      disabled={disabled}
      className={`btn btn-primary ${className} ${
        loading ? "btn-disabled" : ""
      }`}
      onClick={async () => {
        if (!wallet?.connected) {
          throw new Error("Wallet not connected");
        } else {
          setLoading(true);
          try {
            await createSubscription(
              provider?.provider!,
              planCode,
              planCreatorAddress,
              wallet
            );
            setLoading(false);
            await onCreate();
          } catch (e) {
            setLoading(false);
          }
        }
      }}
    >
      {text || "Subscribe Now"}{" "}
      {loading && <div className="loading-spinner loading"></div>}
    </button>
  );
};
