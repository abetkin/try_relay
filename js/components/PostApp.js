import AddPostMutation from '../mutations/AddPostMutation'
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
    debugger
    return <Post data={data}/>
  }
  
})


export default Relay.createContainer(PostApp, {
  fragments: {
    // postInfo: () => RelayQL`
    // `,
    att: () => Relay.QL`
      fragment on Post {
        id
      }
    `,
  },
});

        // comments {
        //     id,
        //     title,
        //     text,
        //     tags,
        // }