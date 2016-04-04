var React = require('react');
var ReactDOM = require('react-dom');
var {Post} = require('./Post');
var Try = require('./Try');


ReactDOM.render(
  <Post id='root'/>,
  document.getElementById("id_main")
)

// ReactDOM.render(
//   <Try/>,
//   document.getElementById("id_try")
// )
