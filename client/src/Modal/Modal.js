import React from 'react';
import moment from 'moment';
import './Modal.css';

export default class Modal extends React.PureComponent {
    render() {
        const {lastActivity, modalActive} = this.props;
        if (!modalActive) return null;
        return <div id="modal-wrapper">
            <div id="modal">
            Last activity on : {moment(lastActivity).format("dddd, MMMM Do YYYY, h:mm:ss a")}
            </div>
        </div>
    }
}