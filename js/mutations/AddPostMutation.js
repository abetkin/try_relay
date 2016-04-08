import Relay from 'react-relay';

export default class AddPostMutation extends Relay.Mutation {

  static fragments = {
    data: () => Relay.QL`
      fragment on Post {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`mutation { addPost }`;
  }

  getVariables() {
    let data = this.props.postData
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
          id
          comments {
            title
            text
            parent
            post_id
            tags
          }
         }
      }
      `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
         post: this.props.id,
      },
    }]
  }

}
