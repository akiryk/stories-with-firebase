import React from 'react';
import withFirebaseConsumer from './with_firebase_consumer';

const SessionContext = React.createContext(null);

const withSessionProvider = Component => {
  class WithSessionProvider extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: JSON.parse(localStorage.getItem('authUser')),
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem('authUser');
          this.setState({ authUser: null });
        }
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <SessionContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </SessionContext.Provider>
      );
    }
  }

  return withFirebaseConsumer(WithSessionProvider);
};

export default SessionContext;

export { withSessionProvider };
