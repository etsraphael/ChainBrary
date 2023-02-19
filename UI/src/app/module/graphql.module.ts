import { NgModule } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkHandler } from 'apollo-angular/http';

const uri = 'https://api.studio.thegraph.com/query/41168/chainbrary/v0.0.6';
export function createApollo(httpLink: HttpLink): {
  link: HttpLinkHandler;
  cache: InMemoryCache;
} {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache()
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
