import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import EditForm from './components/EditForm';
import * as EditSignupActions from '../../modules/editSignup/actions';
import * as SingleEventActions from '../../modules/singleEvent/actions';
import './EditSignup.scss';

class EditSignup extends React.Component {
  static propTypes = {
    getSignupAndEventAsync: PropTypes.func.isRequired,
    deleteSignupAsync: PropTypes.func.isRequired,
    signup: PropTypes.object,
    event: PropTypes.object,
    error: PropTypes.bool,
    loading: PropTypes.bool,
    params: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.deleteSignup = this.deleteSignup.bind(this);
    this.updateSignup = this.updateSignup.bind(this);
  }

  componentWillMount() {
    this.props.resetEventState();
    const { id, editToken } = this.props.params;
    this.props.getSignupAndEventAsync(id, editToken);
  }

  deleteSignup() {
    const confirmation = window.confirm(
      'Viimeinen varoitus! Haluatko todella poistaa ilmoittautumisesi?'
    );
    if (confirmation) {
      const { id, editToken } = this.props.params;
      this.props.deleteSignupAsync(id, editToken);
    }
  }

  async updateSignup(answers) {
    this.toastId = toast.info('Ilmoittautuminen käynnissä', {});

    const response = await this.props.updateSignupAsync(
      this.props.signup.id,
      {
        editToken: this.props.params.editToken,
        ...answers,
      },
    );
    const success = response === true;
    if (success) {
      toast.update(this.toastId, {
        render: 'Muokkaus onnistui!',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      this.props.updateEventAsync(this.props.event.id);
      this.setState({
        formOpened: false,
      });
    } else {
      const toastText =
        'Muokkaus ei onnistunut. Tarkista, että kaikki pakolliset kentät on täytetty ja yritä uudestaan.';
      toast.update(this.toastId, {
        render: toastText,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    }

  }

  render() {
    if (new Date(this.props.event.registrationEndDate) < new Date()) {
      return (
        <div className="container align-items-center">
          <div className="EditSignup--wrapper">
            <h1>Hups, jotain meni pieleen</h1>
            <p>Ilmoittautumistasi ei voi enää muokata tai perua, koska tapahtuman ilmoittautuminen on sulkeutunut.</p>
            <Link to={`${PREFIX_URL}/`} className="btn btn-default">
              Takaisin etusivulle
            </Link>
          </div>
        </div>
      );
    }
    if (this.props.deleted) {
      return (
        <div className="container align-items-center">
          <div className="EditSignup--wrapper">
            <h1>Ilmoittautumisesi poistettiin onnistuneesti</h1>
            <Link to={`${PREFIX_URL}/`} className="btn btn-default">
              Takaisin etusivulle
            </Link>
          </div>
        </div>
      );
    }
    if (this.props.error) {
      return (
        <div className="container align-items-center">
          <div className="EditSignup--wrapper">
            <h1>Hups, jotain meni pieleen</h1>
            <p>
              Ilmoittautumistasi ei löytynyt. Se saattaa olla jo poistettu, tai sitten jotain muuta kummallista
              tapahtui. Jos ilmoittautumisesi ei ole vielä poistunut, yritä kohta uudestaan.
            </p>
          </div>
        </div>
      );
    }

    if (this.props.loading) {
      return (
        <div className="container align-items-center">
          <div className="EditSignup--wrapper">
            <Spinner name="circle" fadeIn="quarter" />
          </div>
        </div>
      );
    }

    return (
      <div className="container align-items-center">
        <EditForm
          submitForm={this.updateSignup}
          signup={this.props.signup}
          event={this.props.event}
          questions={this.props.signup.answers}
          loading={this.props.loading}
        />
        <div className="EditSignup--wrapper">
          <h2>Poista ilmoittautuminen</h2>
          <p>
            Oletko varma että haluat poistaa ilmoittautumisesi tapahtumaan <strong>{this.props.event.title}?</strong>
          </p>
          <p>
            Jos poistat ilmoittautumisesi, menetät paikkasi jonossa. Jos kuitenkin muutat mielesi, voit aina
            ilmoittautua tapahtumaan uudelleen myöhemmin, mutta siirryt silloin jonon hännille.{' '}
            <strong>Tätä toimintoa ei voi perua.</strong>
          </p>
          <button onClick={this.deleteSignup} className="btn btn-danger">
            Poista ilmoittautuminen
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateEventAsync: SingleEventActions.updateEventAsync,
  updateSignupAsync: SingleEventActions.completeSignupAsync,
  getSignupAndEventAsync: EditSignupActions.getSignupAndEventAsync,
  deleteSignupAsync: EditSignupActions.deleteSignupAsync,
  resetEventState: EditSignupActions.resetEventState,
};

const mapStateToProps = state => ({
  event: state.editSignup.event,
  signup: state.editSignup.signup,
  error: state.editSignup.error,
  loading: state.editSignup.loading,
  deleted: state.editSignup.deleted,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditSignup);
