const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.01")
  });

  console.log("Contract added to: ", waveContract.address);
  const allWaves0 = await waveContract.getAllWaves(); // uninitialized error...が出なくなった?_?
  console.log(allWaves0);

  const contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

  const waveCount = await waveContract.getTotalWaves();
  const waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();

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
