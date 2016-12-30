import React from 'react';
import './ViewProgress.scss';
import Separator from '../../../../components/Separator';

export class ViewProgress extends React.Component {
  render() {
    return (
      <div>
        {this.props.data.quotaName}
        <div className="progress">
          <div className="progress-bar" role="progressbar"
            style={{ minWidth: '4em', width: `${(this.props.data.going / this.props.data.max) * 100}%` }}>
            {this.props.data.going}
            <Separator />
            {this.props.data.max}
          </div>
        </div>
      </div>
    );
  }
}

ViewProgress.propTypes = {
  data: React.PropTypes.shape({
    quotaName: React.PropTypes.string,
    going: React.PropTypes.number,
    max: React.PropTypes.number,
  }).isRequired,
};

export default ViewProgress;
