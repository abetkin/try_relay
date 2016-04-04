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

var posts = {
    root: {
        text: 'root',
        children: [1,2,3,4],
    },
    1 : {
        text: 'Post 1',
        children: [2, 4]
    },
    2: {
        text: 'Post 2',
        children: [3],    
    },
    3: {
        text: 'Post 3',
        children: []
    },
    4: {
        text: 'Post 4',
        children: []
    },
    
}

var Post = React.createClass({
    getInitialState: function() {
        return {
            expanded: false,
        }
    },
    getData: function() {
        var id = this.props.id
        if (this.props.getById) {
            return this.props.getById(id)
        }
        return posts[this.props.id]
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
        var add = this.props.addComment || (() => {
            var newId = Object.keys(posts).length
            var rand = getRandomInt(0, 10000)
            posts[newId] = {
                text: 'Comment ' + rand,
                children: [],
            }
            var data = this.getData()
            data.children.push(newId)
        })
        add()
        this.forceUpdate()
    },

    toggleExpanded: function(){
        this.setState({
            expanded: !this.state.expanded,
        })
    },
    
    getDetails: function() {
        var data = this.getData()
        return (<div style={{paddingLeft: this.offset}}>
            {data.children.map((post_id) => {
                return <Post id={post_id} key={post_id} parent={this}/>
            })}
            <a href='#' onClick={this.addComment}>Comment</a>
        </div>)
    },
    
    getShortDescription: function() {
        var restrict = this.props.descriptionSize
        var data = this.getData()
        if (data.title) {
            restrict -= data.title.length
        }
        var text = data.text.substring(0, restrict)
        if (text.length != data.text.length) {
            text = text.substring(0, text.length - 3) + '...'
        }
        return (<span>
            {data.title && <h6>data.title</h6>}
            <a href='#' onClick={this.toggleExpanded} className="link-gray-dark">{text}</a>
        </span>)
    },

    render: function() {
        return (<div>
            {this.getShortDescription()}
            {this.state.expanded && this.getDetails()}
        </div>)
    }
})

module.exports = {Post}