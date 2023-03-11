import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { IProfileAdded } from './../../../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private apollo: Apollo) {}

  getAccountByPublicAddress(
    userAddress: string
  ): Observable<ApolloQueryResult<{ memberAccountSaveds: IProfileAdded[] }>> {
    return this.apollo.query({
      query: gql`
        query ($userAddress: String!) {
          memberAccountSaveds(where: { userAddress: $userAddress }) {
            id
            blockNumber
            blockTimestamp
            description
            expirationDate
            imgUrl
            organizationKey
            transactionHash
            userName
            userAddress
          }
        }
      `,
      variables: {
        userAddress
      }
    });
  }
}
