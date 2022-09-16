import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
const contractAddress = '0x3294A49cF5C7e0e161B1950Ca7cFf21B6cdC3E27';

export default function App() {
  const [currentAccount, setCurrentAccount] = React.useState("");
  console.log("currentAccount: ", currentAccount);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, abi.abi, signer);
        const count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        const count2 = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count2.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="hand-wave">👋</span>{" "} WELCOME!
        </div>

        <div className="bio">
        イーサリアムウォレットを接続して、「
        <span role="img" aria-label="hand-wave">👋</span>
        (wave)」を送ってください
        <span role="img" aria-label="shine">✨</span>
        </div>

        <button className="waveButton" onClick={wave}>
        Wave at Me
        </button>
        { !currentAccount && (
          <button className="waveButton" onClick={connectWallet}>Connect Wallet</button>
        )}
        { currentAccount && (
          <button className="waveButton" onClick={connectWallet}>Wallet Collected</button>
        )}
      </div>
    </div>
  );
}
