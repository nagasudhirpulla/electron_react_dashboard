// https://jasonwatmore.com/post/2018/01/23/react-custom-modal-window-dialog-box
import React from 'react';

const defaultStyles = {
    modal: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1000,
        overflow: 'auto'
    },
    body: {
        padding: 20,
        backgroundColor: '#fff',
        margin: 40
    },
    background: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#000',
        opacity: 0.75,
        zIndex: 900
    }
};

class JwModal extends React.Component {
    //--- static methods ---//

    static modals = [];

    static open = (id) => (e) => {
        e.preventDefault();

        // open modal specified by id
        let modal = JwModal.modals.find(x => x.props.id === id);
        modal.setState({ isOpen: true });
        document.body.classList.add('jw-modal-open');
    }

    static close = (id) => (e) => {
        e.preventDefault();

        // close modal specified by id
        let modal = JwModal.modals.find(x => x.props.id === id);
        modal.setState({ isOpen: false });
        document.body.classList.remove('jw-modal-open');
    }

    //--- instance methods ---//

    styles = { ...defaultStyles };

    constructor(props) {
        super(props);

        this.state = { isOpen: false };

        this.handleClick = this.handleClick.bind(this);

        // merge custom styles with default styles
        if (props.style) {
            this.styles = {
                modal: { ...defaultStyles.modal, ...props.style.modal },
                body: { ...defaultStyles.body, ...props.style.body },
                background: { ...defaultStyles.background, ...props.style.background },
            };
        }
    }

    componentDidMount() {
        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // add this modal instance to the modal service so it's accessible from other components
        JwModal.modals.push(this);
    }

    componentWillUnmount() {
        // remove this modal instance from modal service
        JwModal.modals = JwModal.modals.filter(x => x.props.id !== this.props.id);
        this.element.remove();
    }

    handleClick(e) {
        // close modal on background click
        if (e.target.className === 'jw-modal') {
            JwModal.close(this.props.id)(e);
        }
    }
    
    render() {
        return (
            <div style={{display: + this.state.isOpen ? '' : 'none'}} onClick={this.handleClick} ref={el => this.element = el}>
                <div className="jw-modal" style={this.styles.modal}>
                    <div className="jw-modal-body" style={this.styles.body}>
                        {this.props.children}
                    </div>
                </div>
                <div className="jw-modal-background" style={this.styles.background}></div>
            </div>
        );
    }
}

export default JwModal;