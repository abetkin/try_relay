import Relay from 'react-relay';

export default class AddPostMutation extends Relay.Mutation {

  static fragments = {}

  getMutation() {
    return Relay.QL`mutation { addPost }`;
  }

  getVariables() {
    let data = this.props.data
    debugger
    return {
      parent_id: data.parent,
      text: data.text,
      title: data.title
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddPostPayload @relay(pattern: true) {
        post {
          post_id
          parent
          title
          text
          tags
          comments {
            title
            text
            tags
            
          }
        }
      }
    `;
  }

  getConfigs() {
    return []
    // return [{
    //   type: 'FIELDS_CHANGE',
    //   fieldIDs: {
    //     // todo
    //     hidingSpot: this.props.hidingSpot.id,
    //     game: this.props.game.id,
    //   },
    // }];
  }

  getOptimisticResponse() {
    // use fragments
    return {
      post: {
        parent_id: this.props.data.id,
        // text: "Sample text",
      }
    };
  }

}
