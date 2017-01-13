import React from 'react';
import './ViewProgress.scss';
import Separator from '../../../../components/Separator';

export class ViewProgress extends React.Component {
  render() {
    if (this.props.max) { // Don' return progress bar if no max limit
      return (
        <div>
          {this.props.title}
          <div className="progress">
            <div className="progress-bar" role="progressbar"
              style={{ minWidth: '5em', width: `${(this.props.value / this.props.max) * 100}%` }}>
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
  title: React.PropTypes.string.isRequired,
  value: React.PropTypes.number.isRequired,
  max: React.PropTypes.number.isRequired,
};

export default ViewProgress;
