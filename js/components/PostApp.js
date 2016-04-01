
import SomeMutation from '../mutations/SomeMutation';
import {Post} from './Post'

import React from 'react';
import Relay from 'react-relay';

class TodoApp extends React.Component {
  mutate = (text) => {
    Relay.Store.commitUpdate(
      new SomeMutation({attr: text})
    );
  };
  render() {
    return (
      <Post mutate={this.mutate} />
    );
  }
}

export default Relay.createContainer(TodoApp, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        totalCount,
        ${AddTodoMutation.getFragment('viewer')},
        ${TodoListFooter.getFragment('viewer')},
      }
    `,
  },
});
