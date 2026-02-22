// NFT_STUDIO — Hardhat Deployment Script
// Usage: npx hardhat run CONTRACTS/deploy.js --network mainnet
// Docs: https://hardhat.org/guides/deploying

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Load config
  const masterConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../_CONFIG/master_config.json"), "utf8")
  );

  const coll     = masterConfig.collection;
  const chain    = masterConfig.chain;
  const apis     = masterConfig.apis;
  const studio   = masterConfig.studio;

  const royaltyBps  = coll.seller_fee_basis_points;  // e.g. 750 = 7.5%
  const royaltyRecv = coll.fee_recipient || studio.artist_wallet;

  console.log("=== NFT DEPLOYMENT ===");
  console.log(`Collection: ${coll.name} (${coll.symbol})`);
  console.log(`Chain:      ${chain.network} (${chain.chain_id})`);
  console.log(`Royalty:    ${royaltyBps / 100}% → ${royaltyRecv}`);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer:   ${deployer.address}`);
  console.log(`Balance:    ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);

  // Deploy
  const Factory = await ethers.getContractFactory("NFTCollection");
  const contract = await Factory.deploy(
    coll.name,
    coll.symbol,
    royaltyRecv,
    royaltyBps
  );

  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log(`\n✓ Deployed: ${address}`);

  // Save address to config
  masterConfig.chain.contract_address = address;
  fs.writeFileSync(
    path.join(__dirname, "../_CONFIG/master_config.json"),
    JSON.stringify(masterConfig, null, 2)
  );
  console.log(`✓ Contract address saved to master_config.json`);

  // Verify on Etherscan (optional)
  if (apis.etherscan_api_key && apis.etherscan_api_key !== "YOUR_ETHERSCAN_KEY") {
    console.log("\nVerifying on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [coll.name, coll.symbol, royaltyRecv, royaltyBps],
      });
      console.log("✓ Verified on Etherscan");
    } catch (e) {
      console.warn("Etherscan verification failed:", e.message);
    }
  }

  // Deployment log
  const log = {
    timestamp:        new Date().toISOString(),
    collection:       coll.name,
    symbol:           coll.symbol,
    contract_address: address,
    deployer:         deployer.address,
    network:          chain.network,
    chain_id:         chain.chain_id,
    royalty_bps:      royaltyBps,
    royalty_receiver: royaltyRecv,
    tx_hash:          contract.deploymentTransaction()?.hash
  };

  const logDir = path.join(__dirname, "../LOGS");
  fs.mkdirSync(logDir, { recursive: true });
  fs.writeFileSync(
    path.join(logDir, `deploy_${coll.name}_${Date.now()}.json`),
    JSON.stringify(log, null, 2)
  );

  console.log("\n=== NEXT STEPS ===");
  console.log("1. Set Merkle root for whitelist:  contract.setMerkleRoot(bytes32)");
  console.log("2. Enable whitelist sale:          contract.setWhitelistSale(true)");
  console.log("3. Enable public sale:             contract.setPublicSale(true)");
  console.log(`4. Set Base URI after reveal:      contract.reveal('ipfs://${masterConfig.ipfs.metadata_folder_cid}/')`);
  console.log("5. Withdraw:                       contract.withdraw()");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });