import Relay from 'react-relay';

export default class AddPostMutation extends Relay.Mutation {

  static fragments = {}

  getMutation() {
    return Relay.QL`mutation { addPost }`;
  }

  getVariables() {
    // default change
    let data = this.props.data
    let rand = getRandomInt(0, 10000)
            
    return {
      parent_id: data.id,
      text: 'Comment ' + rand,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddPostPayload @relay(pattern: true) {
        post {
          post_id
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
