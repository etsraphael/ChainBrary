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

// TODO
// graph init \
// --product subgraph-studio
// --from-contract <CONTRACT_ADDRESS> \
// [--network <ETHEREUM_NETWORK>] \
// [--abi <FILE>] \
// <SUBGRAPH_SLUG> [<DIRECTORY>]

async function main(): Promise<void> {
  for (const contract of contracts) {
    // const { address, abi, network, subgrapSlug, directory } = contract;
    // const command = `graph init --product subgraph-studio --from-contract ${address} --network ${network} --abi ${abi} ${subgrapSlug} ${directory}`;
    // console.log("command", command);
    // exec(command, (error, stdout, stderr) => {
    //   if (error) {
    //     console.log(`error: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     console.log(`stderr: ${stderr}`);
    //     return;
    //   }
    //   console.log(`stdout: ${stdout}`);
    // });
    // has to be fix
  }

 

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
