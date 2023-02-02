import { ethers } from "hardhat";
import { exec } from "child_process";

interface IContract {
  address: string;
  abi: string;
  network: string;
  subgrapSlug: string;
  directory: string;
}

const contracts: IContract[] = [
  {
    address: "0xe7cb13702124b8ee8dc32648b06b99b0bbdb63d0",
    abi: "./abi/contracts/ProfileStorage.sol/CertifiedProfiles.json",
    network: "ethereum",
    subgrapSlug: "chainbrary",
    directory: "subgraph",
  },
];

async function main(): Promise<void> {
  // loops through the contracts and deploys them
  for (let c of contracts) {
    // TODO
    // graph init \
    // --product subgraph-studio
    // --from-contract <CONTRACT_ADDRESS> \
    // [--network <ETHEREUM_NETWORK>] \
    // [--abi <FILE>] \
    // <SUBGRAPH_SLUG> [<DIRECTORY>]
    //   exec(`graph init --product subgraph-studio --from-contract ${c.address} --network ${c.network} --abi ${c.abi} ${c.subgrapSlug} ${c.directory}`, (error, stdout, stderr) => {
    //     if (error) {
    //       console.log(`error: ${error.message}`);
    //       return;
    //     }
    //     if (stderr) {
    //       console.log(`stderr: ${stderr}`);
    //       return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //   });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
