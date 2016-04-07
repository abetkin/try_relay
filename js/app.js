
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
// import PostApp from './components/PostApp';

import PostAppHomeRoute from './routes/PostAppHomeRoute';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



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
  
  renderFetched: function(data) {
    return <PostInfoCo toggleExpanded={this.props.toggleExpanded}
                     postId={this.props.postId}
                     {...data} />
  },
  
  render: function() {
    let postId = this.props.postId
    return (<Relay.RootContainer
      Component={PostInfoCo}
      route={new PostAppHomeRoute({rootId: postId})}
      renderFetched={this.renderFetched}
    />)
  }
})


let Post = React.createClass({
  // TODO offset
  
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
    return <PostInfoRoot postId={this.props.postId}
                         toggleExpanded={this.toggleExpanded} />
  },
  
  render: function() {
    let postId = this.props.postId
    return (<div>
      {this.renderPostInfo()}
      {this.state.expanded &&
        <PostCommentsRoot postId={postId}
                          toggleExpanded={this.toggleExpanded} />}
    </div>)
  }
})

let PostComments = React.createClass({
  
  addComment: function() {
    let callbacks = {
        onSuccess: (resp) => {
          console.log('add post success', resp)
          this.props.forceUpdate()
        }
    }
    let newData = {
      text: 'Comment ' + getRandomInt(0, 10000),
      title: '',
      parent: this.props.postId,
    }
    Relay.Store.commitUpdate(
      new AddPostMutation({data: newData}),
      callbacks
    )
  },
  
  render: function() {
    let items = this.props.data.comments
    return (<div>
      {items.map((post) => <Post postInfo={post}
                                  postId={post.post_id}
                                  toggleExpanded={this.props.toggleExpanded} />)}
      <a href='#' onClick={this.addComment}>Comment</a>
    </div>)
      
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

let PostCommentsRoot = React.createClass({
  
  renderFetched: function(data) {
    return <PostCommentsCo toggleExpanded={this.props.toggleExpanded}
                     postId={this.props.postId}
                     forceUpdate={() => this.forceUpdate()}
                     {...data} />
  },
  
  render: function() {
    let postId = this.props.postId
    return (<Relay.RootContainer
      Component={PostCommentsCo}
      route={new PostAppHomeRoute({rootId: postId})}
      forceFetch={true}
      renderFetched={this.renderFetched}
    />)
  }
})



ReactDOM.render(
  <Post postId={1} expanded={true}/>,
  document.getElementById('id_main')
);
