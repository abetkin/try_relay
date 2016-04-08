import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    data: () => Relay.QL`query { getPost(id: $postId) }`,
  }

  static routeName = 'PostRoute';
}
