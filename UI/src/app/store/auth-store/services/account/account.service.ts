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
  ): Observable<ApolloQueryResult<{ memberAccountAddeds: IProfileAdded[] }>> {
    return this.apollo.query({
      query: gql`
        query ($userAddress: String!) {
          memberAccountAddeds(where: { userAddress: $userAddress }) {
            id
            userAddress
            userName
            imgUrl
            blockTimestamp
            expirationDate
            description
          }
        }
      `,
      variables: {
        userAddress
      }
    });
  }
}
