const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();

  console.log("Contract added to: ", waveContract.address);
  //const allWaves0 = await waveContract.getAllWaves(); // uninitialized error
  //console.log(allWaves0);

  const waveCount = await waveContract.getTotalWaves();
  const waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();

  const waveTxn2 = await waveContract.connect(randomPerson).wave("Another message!");
  await waveTxn2.wait();

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
