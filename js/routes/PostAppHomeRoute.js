import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    rootPost: () => Relay.QL`query { Post(id: 0) {
      title
      text
      tags
      post_id
      comments {
        title
        text
        parent
        post_id
        tags
      }
    }}`,
  }
  static routeName = 'PostAppHomeRoute';
}
