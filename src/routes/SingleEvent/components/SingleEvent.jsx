import React from 'react'
import {Link} from 'react-router'

/* Render a single item
*/

class SingleEvent extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    // get the event with correct id
    console.log(this.props.params.id);
  }
  render(){
    // TODO: rendering multiple quotas
    // http://stackoverflow.com/questions/25034994/how-to-correctly-wrap-few-td-tags-for-jsxtransformer

    return (
      <h1>Single Event #{this.props.params.id}</h1>
    )
  }
}

SingleEvent.propTypes = {
}

export default SingleEvent
