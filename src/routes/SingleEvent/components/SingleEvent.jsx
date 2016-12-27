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
        <h1>{this.props.singleEvent.name}</h1>
        <p>{this.props.singleEvent.date}<br />{this.props.singleEvent.price}</p>
        <p>{this.props.singleEvent.description}</p>
        <h3>{typeof this.props.singleEvent.quota !== 'undefined' ? 'Korvaa kiintiön nimellä' : null }</h3>
        <table className='table table-striped'>
          <thead className='tableHeads'><tr>
            <th>Sija</th>
            <th>Nimi</th>
            {typeof this.props.singleEvent.quota !== 'undefined' ? <th>Oma tyssäri jos on</th> : null }
          </tr></thead>
        </table>
      </div>
    )
  }
}

SingleEvent.propTypes = {
}

export default SingleEvent
