import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { loadAuth } from './store/auth-store/state/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ChainBrary';

  constructor(private store: Store, private apollo: Apollo) {}

  ngOnInit(): void {
    // this.store.dispatch(loadAuth());
    // this.test1()
    // this.test2();
  }

  test1(): void {
    const query = gql`
      {
        profileAddeds(first: 5) {
          id
          userAddress
          username
          imgUrl
        }
      }
    `;

    this.apollo.query({ query: query }).subscribe(console.log);
  }

  test2(): void {
    // get user by address id
    const query = gql`
      query($userAddress: String!) {
        profileAddeds(where: { userAddress: $userAddress }) {
        id
        userAddress
        username
        imgUrl
      }
    }`;
    const variables = {
      userAddress: '0xbA3Fc0648186a79baEF8DCeE9e055873F432a351'
    };

    this.apollo.query({ query: query, variables: variables }).subscribe(console.log);
  }
}
