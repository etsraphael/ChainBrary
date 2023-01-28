import {
  OwnershipTransferred as OwnershipTransferredEvent,
  ProfileAdded as ProfileAddedEvent
} from "../generated/CertifiedAccount/CertifiedAccount"
import { OwnershipTransferred, ProfileAdded } from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProfileAdded(event: ProfileAddedEvent): void {
  let entity = new ProfileAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.userAddress = event.params.userAddress
  entity.username = event.params.username
  entity.description = event.params.description
  entity.expirationDate = event.params.expirationDate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
