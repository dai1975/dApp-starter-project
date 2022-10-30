import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
import deploylog from './utils/log.goerli.json';
console.log("contract address: ", deploylog.Contract_deployed_to);


export default function App() {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [messageValue, setMessageValue] = React.useState("");
  const [allWaves, setAllWaves] = React.useState([]);
  console.log("currentAccount: ", currentAccount);

  const getAllWaves = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(deploylog.Contract_deployed_to, abi.abi, signer);

        const waves = await wavePortalContract.getAllWaves();
        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(deploylog.Contract_deployed_to, abi.abi, signer);
        const count = await wavePortalContract.getTotalWaves(); //uninitialized error
        console.log("Retrieved total wave count...", count.toNumber());

        const contractBalance = await provider.getBalance(wavePortalContract.address);
        console.log("Contract balance:", ethers.utils.formatEther(contractBalance));

        const waveTxn = await wavePortalContract.wave(messageValue, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        const count2 = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count2.toNumber());

        const contractBalance_post = await provider.getBalance(wavePortalContract.address);
        if (contractBalance_post.lt(contractBalance)) {
          console.log("User won ETH!");
        } else {
          console.log("User didn't won ETH!");
        }
        console.log("Contract balance after wave:", ethers.utils.formatEther(contractBalance_post));

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (e) {
      console.log(e);
    }
  };

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
        getAllWaves();
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
      getAllWaves();
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(deploylog.Contract_deployed_to, abi.abi, signer);
      wavePortalContract.on("NewWave", onNewWave);

      return () => {
        wavePortalContract.off("NewWave", onNewWave);
      };
    } else {
      return () => { };
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="hand-wave">👋</span>{" "} WELCOME!
        </div>

        <div className="bio">
        イーサリアムウォレットを接続して、メッセージを作成したら、
        <span role="img" aria-label="hand-wave">👋</span>
        を送ってください
        <span role="img" aria-label="shine">✨</span>
        </div>

        { !currentAccount && (
          <button className="waveButton" onClick={connectWallet}>Connect Wallet</button>
        )}
        { currentAccount && (
          <button className="waveButton" onClick={connectWallet}>Wallet Collected</button>
        )}

        <button className="waveButton" onClick={wave}>
        Wave at Me
        </button>

        { currentAccount && (
          <textarea name="messageArea" placeholder="メッセージはこちら" type="text" id="message" value={messageValue} onChange={(e) => setMessageValue(e.target.value)} />
        )}

        { currentAccount && allWaves.slice(0).reverse().map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "#F8F8FF", marginTop: "16px", padding: "8px" }} >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
