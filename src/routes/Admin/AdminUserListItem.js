import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/* Render a single item
*/

class AdminUserListItem extends React.Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        onDelete: PropTypes.func.isRequired,
    };

    render() {
        const { data } = this.props;
        return (
            <tr>
                <td>
                    {data.email}
                </td>
                <td>
                    <a onClick={() => this.props.onDelete(data.id)}>Poista käyttäjä</a>
                </td>
            </tr>
        );
    }
}

export default AdminUserListItem;
