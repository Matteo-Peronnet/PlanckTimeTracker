import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {Button, Spin} from 'antd';
import {injectIntl, FormattedMessage} from "react-intl";

@injectIntl
class TimerStep extends React.Component {
    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.element).isRequired,
        update: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        timeSpentLoading: PropTypes.bool.isRequired,
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
        const { index, children, timeSpentLoading } = this.props;
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
                                <FormattedMessage id="pages.timer.steps.previous"/>
                            </Button>
                        )
                    }
                    {
                        index < children.length - 1
                        && <Button type="primary" onClick={() => this.next()}>
                            <FormattedMessage id="pages.timer.steps.next"/>
                        </Button>
                    }
                    {
                        index === children.length - 1
                        && <Spin spinning={timeSpentLoading}>
                            <Button type="primary" onClick={() => this.onSubmit()}>
                                <FormattedMessage id="pages.timer.steps.send"/>
                            </Button>
                        </Spin>
                    }
                </div>
            </Fragment>
        )
    };
}

export default TimerStep;
