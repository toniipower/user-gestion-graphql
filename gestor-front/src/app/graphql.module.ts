import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpClientModule } from '@angular/common/http';
import { setContext } from '@apollo/client/link/context';

export function createApollo(httpLink: HttpLink) {
  console.log('Configurando Apollo Client');
  
  const http = httpLink.create({
    uri: 'http://localhost:8080/graphql',
    withCredentials: true
  });

  const auth = setContext((operation, context) => {
    const token = localStorage.getItem('token');
    console.log('Auth Link: Token encontrado:', token ? 'Sí' : 'No');
    
    if (!token) {
      return {};
    }
    
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  });

  const errorLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
      console.log('GraphQL Response:', response);
      return response;
    });
  });

  return {
    cache: new InMemoryCache(),
    link: ApolloLink.from([auth, errorLink, http]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  };
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {} 