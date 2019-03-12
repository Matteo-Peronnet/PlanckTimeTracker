import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';

export default class TimerStep extends React.Component {
    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.element).isRequired,
        update: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
    }

    next() {
        this.props.update(this.props.index + 1);
    }

    prev() {
        this.props.update(this.props.index - 1);
    }

    onSubmit() {
        this.props.onSubmit();
    }

    renderItem = (index) => (
        <div>
            {this.props.children[index]}
        </div>
    );

    render = () => {
        const { index, children } = this.props;
        return (
            <Fragment>
                {
                    this.renderItem(index)
                }
                <div className={`flex flex-auto pa3 items-center ${index > 0 ? 'justify-between' : 'justify-end'}`}>
                    {
                        index > 0
                        && (
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                Previous
                            </Button>
                        )
                    }
                    {
                        index < children.length - 1
                        && <Button type="primary" onClick={() => this.next()}>Next</Button>
                    }
                    {
                        index === children.length - 1
                        && <Button type="primary" onClick={() => this.onSubmit()}>Done</Button>
                    }
                </div>
            </Fragment>
        )
    };
}
