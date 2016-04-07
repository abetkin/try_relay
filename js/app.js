
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import PostApp from './components/PostApp';

import PostAppHomeRoute from './routes/PostAppHomeRoute';

import AddPostMutation from './mutations/AddPostMutation'
// import EditPostMutation from './mutations/EditPostMutation';
// import {PostInfo} from './components/PostInfo'
// import {PostComments} from './components/PostComments'

let PostInfo = React.createClass({
  getDefaultProps: function() {
      return {
          descriptionSize: 140
      }
  },
  
  render: function() {
    var restrict = this.props.descriptionSize
    var data = this.props.data
    if (data.title) {
        restrict -= data.title.length
    }
    var text = data.text.substring(0, restrict)
    if (text.length != data.text.length) {
        text = text.substring(0, text.length - 3) + '...'
    }
    return (<span>
        <a href='#' onClick={this.props.toggleExpanded}
                    className="link-gray-dark">
            {data.title && <b>{data.title}</b>} {text}
        </a>
    </span>)
  }
})


let PostInfoCo = Relay.createContainer(PostInfo, {
  fragments: {
    data: () => Relay.QL`
      fragment on Post {
        title
        text
        tags
        post_id
      }
    `,
  },
})

let PostInfoRoot = React.createClass({
  addPost: function(newData) {
    Relay.Store.commitUpdate(
      new AddPostMutation({data: newData})
    )
  },
  
  renderFetched: function(data) {
    return <PostInfo addPost={this.addPost}
                     toggleExpanded={this.props.toggleExpanded}
                     {...data} />
  },
  
  render: function() {
    let postId = this.props.postId
    return (<Relay.RootContainer
      Component={PostApp}
      route={new PostAppHomeRoute({rootId: postId})}
      renderFetched={this.renderFetched}
    />)
  }
})

// let addPost = (newData) =>
//     ;

// let renderFetched = (data) => (
//   <PostApp renderPost={renderPost}
//            addPost={addPost} 
//            {...data}/>
// )

// let renderPost = (post_id) => (<Relay.RootContainer
//   Component={PostApp}
//   route={new PostAppHomeRoute({rootId: post_id})}
//   renderFetched={renderFetched}
// />)


let Post = React.createClass({
  getInitialState: function() {
    return {expanded: !!this.props.expanded}
  },
  
  toggleExpanded: function() {
    this.setState({expanded: !this.state.expanded})
  },
  
  renderPostInfo: function() {
    if (this.props.postInfo) {
      return <PostInfo data={this.props.postInfo}
                       toggleExpanded={this.toggleExpanded} />
    }
    return <PostInfoRoot postId={postId}
                         toggleExpanded={this.toggleExpanded} />
  },
  
  render: function() {
    let postId = this.props.postId
    return (<div>
    {this.renderPostInfo()}
    {this.state.expanded &&
      <PostCommentsRoot postId={postId}
                        toggleExpanded={this.toggleExpanded}/>}
  </div>)
  }
})

let PostComments = React.createClass({
  render: function() {
    let items = this.props.data.comments
    let toggleExpanded = this.props.toggleExpanded
    return items.map((post) => <Post postInfo={post}
                                     toggleExpanded={toggleExpanded}/>)
  }
})


let PostCommentsCo = Relay.createContainer(PostComments, {
  fragments: {
    data: () => Relay.QL`
      fragment on Post {
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
})





ReactDOM.render(
  <Post postId={1} expanded={true}/>,
  document.getElementById('id_main')
);
