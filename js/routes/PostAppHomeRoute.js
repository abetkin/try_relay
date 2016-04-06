import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    att: () => Relay.QL`query {
      getPost(id: $rootId)
    }`,
  }

  static routeName = 'TestRoute';
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
      