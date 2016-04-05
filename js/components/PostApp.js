
import AddPostMutation from '../mutations/AddPostMutation';
// import EditPostMutation from '../mutations/EditPostMutation';
import {Post} from './Post'

import React from 'react';
import Relay from 'react-relay';

const PostApp = React.createClass({
  addPost: function() {
    var params = {
        parent: this.id,
        
    }
    Relay.Store.commitUpdate(
      new AddPostMutation({data: this.props.data})
    );
  },
  render: function() {
    let data = this.props.data
    return <Post data={data}/>
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
