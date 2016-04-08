
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import PostAppHomeRoute from './routes/PostAppHomeRoute';
import AddPostMutation from './mutations/AddPostMutation'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


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
    return (<Relay.RootContainer
      Component={PostInfoCo}
      route={new PostAppHomeRoute({rootId: this.props.postId})}
      renderFetched={this.renderFetched}
    />)
  }
})


let Post = React.createClass({
  
  getInitialState: function() {
    return {expanded: !!this.props.expanded}
  },
  
  getDefaultProps: function() {
    return {offset: 0}
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
                          toggleExpanded={this.toggleExpanded}
                          offset={this.props.offset} />
      }
    </div>)
  }
})

let PostComments = React.createClass({
  
  addComment: function() {
    let newData = {
      text: 'Comment ' + getRandomInt(0, 10000),
      title: '',
      parent: this.props.postId,
    }
    Relay.Store.commitUpdate(
      new AddPostMutation({postData: newData, id: this.props.data.id})
    )
  },
  
  render: function() {
    let items = this.props.data.comments
    
    
    
    let offset = this.props.offset + 10
    return (<div style={{paddingLeft: offset}}>
      {items.map((post) => <Post  postInfo={post}
                                  postId={post.post_id}
                                  toggleExpanded={this.props.toggleExpanded}
                                  offset={offset} />)}
      <a href='#' onClick={this.addComment}>
        <i>add comment</i>
      </a>
    </div>)
      
  }
})


let PostCommentsCo = Relay.createContainer(PostComments, {
  fragments: {
    data: () => Relay.QL`
      fragment on Post {
        id
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
                     offset={this.props.offset}
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
