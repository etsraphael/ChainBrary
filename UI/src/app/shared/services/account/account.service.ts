import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrganization, IProfileAdded } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  organizationName = environment.organizationName;

  constructor(private apollo: Apollo) {}

  getAccountByPublicAddressAndOrganization(
    userAddress: string
  ): Observable<ApolloQueryResult<{ memberAccountSaveds: IProfileAdded[]; organizationSaveds: IOrganization[] }>> {
    return this.apollo.query({
      query: gql`
        query ($userAddress: String!, $organizationName: String!) {
          memberAccountSaveds(
            orderBy: blockTimestamp
            orderDirection: desc
            first: 1
            where: { userAddress: $userAddress, organizationKey: $organizationName }
          ) {
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
          organizationSaveds(
            orderBy: blockTimestamp
            orderDirection: desc
            first: 1
            where: { key: $organizationName }
          ) {
            key
            pricePerDay
          }
        }
      `,
      variables: {
        userAddress,
        organizationName: this.organizationName
      }
    });
  }

  getCertifiedAccountByPublicAddress(
    userAddress: string
  ): Observable<ApolloQueryResult<{ memberAccountSaveds: IProfileAdded[] }>> {
    const currentDate = String(Math.round(new Date().getTime() / 1000));

    return this.apollo.query({
      query: gql`
        query ($userAddress: String!, $organizationName: String!, $currentDate: String!) {
          memberAccountSaveds(
            orderBy: blockTimestamp
            orderDirection: desc
            first: 1
            where: { userAddress: $userAddress, organizationKey: $organizationName, expirationDate_gt: $currentDate }
          ) {
            id
            description
            expirationDate
            imgUrl
            organizationKey
            userName
            userAddress
          }
        }
      `,
      variables: {
        userAddress,
        organizationName: this.organizationName,
        currentDate
      }
    });
  }
}
