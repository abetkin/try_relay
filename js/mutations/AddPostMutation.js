import Relay from 'react-relay';

export default class AddPostMutation extends Relay.Mutation {

  static fragments = {}

  getMutation() {
    return Relay.QL`mutation { addPost }`;
  }

  getVariables() {
    let data = this.props.data
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
  }

  getOptimisticResponse() {
    return {
      post: {
        parent_id: this.props.data.id,
      }
    };
  }

}
