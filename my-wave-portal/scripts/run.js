const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("Contract deployed to: ", wavePortal.address);
  console.log("Contract deployed by: ", owner.address);

  const waveCount = await waveContract.getTotalWaves();
  const waveTxn = await waveContract.wave();
  await waveTxn.wait();

  const waveCount2 = await waveContract.getTotalWaves();

  const waveTxn2 = await waveContract.connect(randomPerson).wave();
  await waveTxn2.wait();

  const waveCount3 = await waveContract.getTotalWaves();
  console.log(waveCount, waveCount2, waveCount3);
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
