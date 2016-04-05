
import AddPostMutation from '../mutations/AddPostMutation';
import EditPostMutation from '../mutations/EditPostMutation';
import {Post} from './Post'

import React from 'react';
import Relay from 'react-relay';

const PostApp = React.createClass({
  addPost: function() {
    var params = {
        parent: this.id,
        
    }
    Relay.Store.commitUpdate(
      new AddPostMutation({attr: text})
    );
  },
  render: function() {
    return (
      <Post id={0}
            getById={this.getById}
      />
    )
  },
  getById: function(id) {
      this.props.data.comments.find(
          //
      )
      // can't do
  }
  
})


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
            id,
            title,
            text,
            tags,
        }
      }
    `,
  },
});
