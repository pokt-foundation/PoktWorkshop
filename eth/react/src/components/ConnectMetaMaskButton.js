import MetaMaskOnboarding from "@metamask/onboarding";
import metaMaskLogo from "../assets/metamask.svg";
import { useCallback, useEffect, useRef, useState } from "react";

const INSTALL_MM_TEXT = "Install MetaMask";
const CONNECT_MM_TEXT = "Connect MetaMask";

const MetaMaskButton = ({ accounts, setAccounts }) => {
  const [buttonText, setButtonText] = useState(INSTALL_MM_TEXT);
  const onboarding = useRef();

  const handleNewAccounts = useCallback(
    (newAccounts) => {
      setAccounts(newAccounts);
    },
    [setAccounts]
  );
  const onClick = useCallback(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts) => handleNewAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }
  }, [handleNewAccounts]);

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_MM_TEXT);
      }
    }
  }, [accounts]);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);
    }
  }, [handleNewAccounts]);

  if (accounts.length === 0) {
    return (
      <button className="MetaMask-button" onClick={onClick}>
        <img src={metaMaskLogo} alt="MetaMask Logo" />
        {buttonText}
      </button>
    );
  } else {
    return <div></div>;
  }
};

export default MetaMaskButton;
