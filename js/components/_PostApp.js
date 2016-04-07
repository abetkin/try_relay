import AddPostMutation from '../mutations/AddPostMutation'
// import EditPostMutation from '../mutations/EditPostMutation';
import {Post} from './Post'

import React from 'react';
import Relay from 'react-relay';

const PostApp = React.createClass({
  addPost: function(newData) {
    Relay.Store.commitUpdate(
      new AddPostMutation({data: newData})
    );
  },
  render: function() {
    let data = this.props.data
    return <Post data={data}
                 addPost={this.addPost}/>
  }
  
})


export default Relay.createContainer(PostApp, {
  fragments: {
    // postInfo: () => RelayQL`
    // `,
    data: () => Relay.QL`
      fragment on Post {
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
      }
    `,
  },
});

