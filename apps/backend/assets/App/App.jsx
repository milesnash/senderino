import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { PrivateRoute } from '../_components';
import { MessagePage } from '../MessagePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';

export class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="row justify-content-center">
                        <Router history={history}>
                            <Switch>
                                <PrivateRoute exact path="/" component={MessagePage} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                                <Redirect from="*" to="/" />
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}
