import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';

import { alertActions } from '../_actions';
import { messageActions } from '../_actions';

class MessagePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: {
                recipientPhoneNumber: '',
                body: ''
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    refreshMessages() {
        Promise.resolve(this.props.getMessages(this.props.messages || []))
            .then(() => {
                this.timeoutId = setTimeout(this.refreshMessages.bind(this), 10000);
            });
    }

    componentDidMount() {
        this.refreshMessages();
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
      }

    handleChange(event) {
        const { name, value } = event.target;
        const { message } = this.state;
        this.setState({
            message: {
                ...message,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { message } = this.state;
        if (message.recipientPhoneNumber && message.body) {
            this.props.create(message);
        }
    }

    render() {
        const { alert, messages } = this.props;
        const { message, submitted } = this.state;
        return (
            <div className="col-sm-12">
                <div className="row justify-content-center">
                    <div className="col-sm-6">
                        <h2>Send a message</h2>
                        <form name="form" onSubmit={this.handleSubmit}>
                            <div className={'form-group' + (submitted && !message.recipientPhoneNumber ? ' has-error' : '')}>
                                <label htmlFor="recipientPhoneNumber">Recipient phone number</label>
                                <input type="text" className="form-control" name="recipientPhoneNumber" value={message.recipientPhoneNumber} onChange={this.handleChange} required placeholder="e.g. 447700900000" />
                                {submitted && !message.recipientPhoneNumber &&
                                    <div className="help-block">Recipient phone number is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !message.body ? ' has-error' : '')}>
                                <label htmlFor="body">Message</label>
                                <textarea className="form-control" name="body" onChange={this.handleChange} maxLength="140" required placeholder="Enter your message..."></textarea>
                                {submitted && !message.body &&
                                    <div className="help-block">Message is required</div>
                                }
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary">Send Message</button>
                            </div>
                            {alert.message && setTimeout(this.props.clearAlerts, 3000) &&
                                <div className="form-group">
                                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                                </div>
                            }
                        </form>
                        <p>
                            <Link to="/login">Logout</Link>
                        </p>
                    </div>
                    <div className="col-sm-12">
                        <h2 style={{display: "inline-block"}}>Messages</h2>{messages.loading && 
                            <img style={{marginLeft: "10px"}} src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        {messages.error && <span className="text-danger">ERROR: {messages.error}</span>}
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                <th scope="col">Created</th>
                                <th scope="col">Created By</th>
                                <th scope="col">Status</th>
                                <th scope="col">Recipient No.</th>
                                <th scope="col">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.items && messages.items.map((message) =>
                                    <tr key={message.statusId}>
                                        <th scope="row">{moment(message.createdAt).fromNow()}</th>
                                        <td>{message.sender.email}</td>
                                        <td>{message.status}</td>
                                        <td>{message.recipientPhoneNumber}</td>
                                        <td>{message.body}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { alert, authentication, messages } = state;
    const { user } = authentication;
    return { alert, user, messages };
}

const actionCreators = {
    getMessages: messageActions.getAll,
    clearAlerts: alertActions.clear,
    create: messageActions.create
}

const connectedMessagePage = connect(mapState, actionCreators)(MessagePage);
export { connectedMessagePage as MessagePage };