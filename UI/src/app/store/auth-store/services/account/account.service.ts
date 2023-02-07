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

  getAccountByPublicAddress(userAddress: string): Observable<ApolloQueryResult<{ profileAddeds: IProfileAdded[] }>> {
    return this.apollo.query({
      query: gql`
        query ($userAddress: String!) {
          profileAddeds(where: { userAddress: $userAddress }) {
            id
            userAddress
            username
            imgUrl
            expirationDate
          }
        }
      `,
      variables: {
        userAddress
      }
    });
  }
}
