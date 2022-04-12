import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as AdminActions from '../../modules/admin/actions';
import UserForm from './UserForm';
import './AdminEventsList.scss';
import { toast } from 'react-toastify';
import AdminUserListItem from './AdminUserListItem';
import { getUsers, usersLoading, usersError } from '../../modules/admin/selectors';


/* Render the list container
*/
class AdminUserList extends React.Component {
    static propTypes = {
        users: PropTypes.array.isRequired,
        updateUsers: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            userFormLoading: false,
        };

        this.onDeleteUser = this.onDeleteUser.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    componentWillMount() {
        this.props.updateUsers();
    }

    createUser(email) {
        console.log(email)
        this.setState({
            userFormLoading: true,
        }, async () => {
            try {
                let success = await this.props.createUserAsync({ email });
                if (success) {
                    toast.success('Käyttäjän luominen onnistui,', { autoClose: 2000 })
                }
                else {
                    toast.error('Käyttäjän luominen epäonnistui.', { autoClose: 2000 });
                }
                this.props.updateUsers();
            } catch (error) {
                console.log(error)
                toast.error('Käyttäjän luominen epäonnistui.', { autoClose: 2000 });
            }

            this.setState({ userFormLoading: false });
        });
    }

    onDeleteUser(userId) {
        if (window.confirm("Haluatko varmasti poistaa tämän käyttäjän? Tätä toimintoa ei voi perua.")) {
            this.props.deleteUser(userId)
                .then((success) => {
                    if (!success) {
                        console.alert("Poisto epäonnistui :(")
                    }
                    this.props.updateUsers();
                });
        }
    }

    renderUserRows() {
        const { users } = this.props;
        return _.map(users, (e) => {
            return (
                <AdminUserListItem
                    key={e.id}
                    data={e}
                    onDelete={this.onDeleteUser}
                />
            );
        });
    }

    render() {
        const { usersLoading, usersError, users } = this.props;
        return (
            <div className="container">
                <Link to={`${PREFIX_URL}/admin`} style={{ margin: 0 }}>
                    &#8592; Takaisin
            </Link>
                <h1>Käyttäjien hallinta</h1>
                {usersLoading && <p>Ladataan...</p>}
                {usersError && <p>Käyttäjien haku epäonnistui</p>}
                {users &&
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Sähköposti</th>
                                <th>Toiminnot</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderUserRows()}
                        </tbody>
                    </table>
                }
                <h1>Luo uusi käyttäjä</h1>
                <UserForm onSubmit={this.createUser} loading={this.state.userFormLoading} />


            </div>
        );
    }
}

const mapDispatchToProps = {
    updateUsers: AdminActions.getUsersAsync,
    deleteUser: AdminActions.deleteUserAsync,
    createUserAsync: AdminActions.createUserAsync
};

const mapStateToProps = state => ({
    users: getUsers(state),
    usersLoading: usersLoading(state),
    usersError: usersError(state),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AdminUserList);
