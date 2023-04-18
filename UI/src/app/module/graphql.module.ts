import { NgModule } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkHandler } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

export function createApollo(httpLink: HttpLink): {
  link: HttpLinkHandler;
  cache: InMemoryCache;
} {
  return {
    link: httpLink.create({ uri: environment.certificationUri }),
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
