import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    // data: () => Relay.QL`query {
    //   Post(id: $rootId)
    // }`,
    data: () => Relay.QL`query { test }`,
  }

  static routeName = 'TestRoute';
}