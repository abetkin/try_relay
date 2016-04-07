import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    att: () => Relay.QL`query { getPost(id: 1) }`,
    // att: () => Relay.QL`query {
    //   getPost(id: 0)
    // }`,
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
      