import React from 'react';

import PropTypes from 'prop-types';

import Separator from '../../../../components/Separator';

import './ViewProgress.scss';

export class ViewProgress extends React.Component {
  render() {
    if (this.props.max) {
      // Don' return progress bar if no max limit
      return (
        <div>
          {this.props.title}
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                minWidth: '5em',
                width: `${(this.props.value / this.props.max) * 100}%`,
              }}
            >
              {this.props.value}
              <Separator />
              {this.props.max}
            </div>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

ViewProgress.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
};

export default ViewProgress;
