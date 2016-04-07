import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    data: () => Relay.QL`query { getPost(id: $rootId) }`,
  }

  static routeName = 'PostAppHomeRoute';
}

        // title
        // text
        // tags
        // post_id
        // comments {
        //   title
        //   text
        //   parent
        //   post_id
        //   tags
        // }
      