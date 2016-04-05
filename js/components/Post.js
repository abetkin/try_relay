/*
BUG: when expanding-collapsing-expanding, the tree state is lost
*/

var 
  React = require('react'),
  ReactDOM = require('react-dom');


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var {createFactory} = React,
    D = React.DOM

let posts = [
    {
        id: 0,
        parent: null,
        title: 'P0',
        text: 'root',
    },
    {
        id: 1,
        parent: 0,
        title: 'P1',
        text: 'Post 1',
    },
    {
        id: 2,
        parent: 1,
        title: 'P2',
        text: 'Post 2',
    },
    {
        id: 3,
        parent: 2,
        title: 'P2',
        text: 'Post 3',
    },
    {
        id: 4,
        parent: 3,
        title: 'P4',
        text: 'Post 4',
    },
]


// var declarePosts = {
//     root: {
//         text: 'root',
//         children: [1,2,3,4],
//     },
//     1 : {
//         text: 'Post 1',
//         children: [2, 4]
//     },
//     2: {
//         text: 'Post 2',
//         children: [3],    
//     },
//     3: {
//         text: 'Post 3',
//         children: []
//     },
//     4: {
//         text: 'Post 4',
//         children: []
//     },
    
// }

// var posts = (() => {
//     let processed = new Set()
//     let result = []
//     Object.keys(declarePosts).forEach((post_id) => {
//         if (processed.has(post_id))
//             return
//         let post = declarePosts[post_id]
//         post.children
        
//     })
//     return result
// })()





var Post = React.createClass({
    getInitialState: function() {
        return {
            expanded: false,
        }
    },
    
    getDefaultProps: function() {
        return {
            descriptionSize: 140
        }
    },
    
    componentWillMount: function() {
        if (!this.props.parent) {
            this.offset = 10
        } else {
            this.offset = this.props.parent.offset + 10
        }
    },
    
    addComment: function(){
        let rand = getRandomInt(0, 10000)
        let newData = {
            text: 'Comment ' + rand,
            // title: 'Title ' + rand,
            parent: this.props.data.id,
        }
        let add = this.props.addPost || ((data) => {
            data.id = posts.length
            posts.push(data)
        })
        add(newData)
        this.forceUpdate()
    },

    getChildren: function() {
        if (this.props.getChildren) {
            return this.props.getChildren()
        }
        let children = []
        let id = this.props.data.id
        return posts.filter((post) => post.parent == id)
    },

    toggleExpanded: function(){
        this.setState({
            expanded: !this.state.expanded,
        })
    },
    
    getDetails: function() {
        var children = this.getChildren()
        return (<div style={{paddingLeft: this.offset}}>
            {children.map(post => <Post data={post}/>)}
            <a href='#' onClick={this.addComment}>Comment</a>
        </div>)
    },
    
    getShortDescription: function() {
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
            <a href='#' onClick={this.toggleExpanded} className="link-gray-dark">
                {data.title && <b>{data.title}</b>} {text}
            </a>
        </span>)
    },

    render: function() {
        return (<div>
            {this.getShortDescription()}
            {this.state.expanded && this.getDetails()}
        </div>)
    }
})

module.exports = {Post, posts}