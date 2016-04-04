
import AddPostMutation from '../mutations/AddPostMutation';
import EditPostMutation from '../mutations/EditPostMutation';
import {Post} from './Post'

import React from 'react';
import Relay from 'react-relay';

class PostApp extends React.createClass({
  addPost: function() {
    Relay.Store.commitUpdate(
      new AddPostMutation({attr: text})
    );
  },
  render: function() {
    return (
      <Post mutate={this.mutate}
            getById={this.getById}
      />
    );
  }
}


export default Relay.createContainer(App, {
  fragments: {
    // postInfo: () => RelayQL`
    // `,
    data: () => Relay.QL`
      fragment on Post {
        title,
        text,
        tags,
        comments(first: 5) {
            title,
            text,
            tags,
        }
      }
    `,
  },
});
