import React from 'react'
import {Link} from 'react-router'

/* Render a single item
*/

class SingleEvent extends React.Component {
  componentWillMount() {
    // get the event with correct id
    console.log(this.props.params.id);
    this.props.getEventInfo()
  }
  render(){
    // TODO: rendering multiple quotas
    // http://stackoverflow.com/questions/25034994/how-to-correctly-wrap-few-td-tags-for-jsxtransformer

    return (
      <div>
        <h1>Single Event #{this.props.params.id}</h1>
        <h2>{this.props.singleEvent.name}</h2>
      </div>
    )
  }
}

SingleEvent.propTypes = {
}

export default SingleEvent
