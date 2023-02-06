import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { IAuth } from './../../../../shared/interfaces';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private apollo: Apollo) {}

  getAccountByPublicAddress(userAddress: string): Observable<ApolloQueryResult<IAuth>> {
    return this.apollo.query({
      query: gql`
        query profileAddeds(userAddress: String!) {
          users(where: { userAddress: $userAddress }) {
            id
            userAddress
            username
            imgUrl
          }
        }
      `,
      variables: {
        userAddress
      }
    });
  }
}
