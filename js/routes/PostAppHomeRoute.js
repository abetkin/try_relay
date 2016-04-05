import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    rootPost: () => Relay.QL`query { Post(id: 0) }`,
  }
  static routeName = 'PostAppHomeRoute';
}
