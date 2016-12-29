import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router';
import Separator from '../../../components/Separator';
import './AdminEventList.scss';

/* Render a single item
*/

class AdminEventListItem extends React.Component {
  render() {
    return (
      <tr>
        <td><Link to={`/event/${this.props.data.id}`}>{ this.props.data.name }</Link></td>
        <td>{moment(this.props.data.date).format('DD.MM.YYYY')}</td>
        <td>Luonnos</td>
        <td>{ _.sumBy(this.props.data.quota, n => n.going) }</td>
        <td>
          <Link>Muokkaa tapahtumaa</Link>
          <Separator />
          <Link>Lataa osallistujalista</Link>
        </td>
      </tr>
    );
  }
}

/* Render the list container
*/

class AdminEventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 0,
      searchString: '',
    };

    this.changeYear = this.changeYear.bind(this);
    this.changeSearchString = this.changeSearchString.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  componentWillMount() {
    this.props.getAdminEventList();
  }

  changeYear(year) {
    const state = this.state;
    state.year = year;
    this.setState(state);
    this.doSearch();
  }

  changeSearchString(str) {
    const state = this.state;
    state.searchString = str;
    this.setState(state);
    this.doSearch();
  }

  doSearch() {
    console.log(this.state);
  }

  render() {
    const yearOptions = [];
    for (let year = 2016; year <= new Date().getFullYear(); year += 1) {
      yearOptions.push(<option value={year}>{year}</option>);
    }

    return (
      <div>
        <Link to="/admin/edit" className="btn btn-success btn-lg pull-right">+ Uusi tapahtuma</Link>
        <h1>Hallinta</h1>
        <div className="alert alert-info" role="alert">
          <p>
            <strong>Ville Vuorenmaa</strong> on pyytänyt pääsyä hallintapaneeliin.<br />
            <a>Hyväksy</a><Separator /><a>Hylkää</a>
          </p>
        </div>
        <div className="search-form">
          <select className="form-control pull-left" onChange={event => this.changeYear(event.target.value)}>
            <option value={0}>Hae vuoden mukaan</option>
            {yearOptions}
          </select>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Hae tapahtumaa…"
              onKeyPress={event => (event.key === 'Enter' ? this.changeSearchString(event.target.value) : '')}
            />
            <span className="input-group-btn">
              <button className="btn btn-default" type="button" onClick={this.doSearch}>Hae</button>
            </span>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Ajankohta</th>
              <th>Tila</th>
              <th>Ilmoittautuneita</th>
              <th>Toiminnot</th>
            </tr>
          </thead>
          <tbody>
            { this.props.eventList.map((i, index) => <AdminEventListItem key={index} data={i} />) }
          </tbody>
        </table>
      </div>
    );
  }

}

AdminEventListItem.propTypes = {
  data: React.PropTypes.object.isRequired,
};

AdminEventList.propTypes = {
  eventList: React.PropTypes.array.isRequired,
  getAdminEventList: React.PropTypes.func.isRequired,
};

export default AdminEventList;
