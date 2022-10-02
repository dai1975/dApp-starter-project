const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1")
  });
  await waveContract.deployed();
  console.log("Contract deployed to: ", waveContract.address);

  const contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

  const waveTxn = await waveContract.wave("This is wave #1");
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave("This is wave #2");
  await waveTxn2.wait();

  const contractBalance2 = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract balance2: ", hre.ethers.utils.formatEther(contractBalance2));

  const allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();
