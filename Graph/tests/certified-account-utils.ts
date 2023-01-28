import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  ProfileAdded
} from "../generated/CertifiedAccount/CertifiedAccount"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createProfileAddedEvent(
  userAddress: Address,
  username: string,
  description: string,
  expirationDate: BigInt
): ProfileAdded {
  let profileAddedEvent = changetype<ProfileAdded>(newMockEvent())

  profileAddedEvent.parameters = new Array()

  profileAddedEvent.parameters.push(
    new ethereum.EventParam(
      "userAddress",
      ethereum.Value.fromAddress(userAddress)
    )
  )
  profileAddedEvent.parameters.push(
    new ethereum.EventParam("username", ethereum.Value.fromString(username))
  )
  profileAddedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  profileAddedEvent.parameters.push(
    new ethereum.EventParam(
      "expirationDate",
      ethereum.Value.fromUnsignedBigInt(expirationDate)
    )
  )

  return profileAddedEvent
}
