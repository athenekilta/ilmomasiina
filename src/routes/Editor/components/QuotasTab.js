import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, Checkbox } from 'formsy-react-components';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import './Editor.scss';

const DragHandle = SortableHandle(() => <span className="handler" />); // This can be any component you want

const SortableItem = SortableElement(({ value }) =>
  <div className="panel panel-default">
    <DragHandle />
    {value}
  </div>);

const SortableItems = SortableContainer(({ collection, items }) =>
  <div>
    {items.map((value, index) => <SortableItem collection={collection} key={index} index={index} value={value} />)}
  </div>,
);


class QuotasTab extends React.Component {

  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.addQuota = this.addQuota.bind(this);
    this.updateQuota = this.updateQuota.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
  }

  updateState(updates) {
    this.setState(updates, () => {
      if (typeof this.props.onDataChange === 'function') {
        this.props.onDataChange(this.state.data);
      }
    });
  }

  handleChange(field, value) {

    this.updateState({
      data: { ...this.state.data, [field]: value },
    });
  }

  addQuota() {
    const quotas = this.state.data.quotas ? this.state.data.quotas : [];

    this.updateState({
      data: {
        ...this.state.data,
        quotas: _.concat(quotas, {
          id: (_.max(quotas.map(n => n.id)) || 0) + 1,
          existsInDb: false,
          title: '',
          max_attendees: 0,
          registration_opens: new Date(),
          registration_closes: new Date(),
        }),
      },
    });
  }

  updateOrder(args) {
    let newQuotas = this.state.data.quotas;

    const elementToMove = newQuotas[args.oldIndex];
    newQuotas.splice(args.oldIndex, 1);
    newQuotas.splice(args.newIndex, 0, elementToMove);

    // Update quota id's
    newQuotas = _.map(newQuotas, (quota, index) => {
      quota.id = index + 1;
      return quota;
    });

    this.updateState({
      data: {
        ...this.state.data,
        quotas: newQuotas,
      },
    });
  }

  updateQuota(itemId, field, value) {
    this.updateState({
      data: {
        ...this.state.data,
        quotas: _.map(this.state.data.quotas, (quota) => {
          if (quota.id === itemId) {
            return {
              ...quota,
              [field]: value,
            };
          }

          return quota;
        }),
      },
    });
  }

  removeQuota(itemId) {
    this.updateState({
      data: {
        ...this.state.data,
        quotas: _.filter(this.state.data.quotas, (quota) => {
          if (quota.id === itemId) {
            return false;
          }

          return true;
        }),
      },
    });
  }

  renderQuotas() {
    const q = _.map(this.state.data.quotas, (item) => {
      return (
        <div className="panel-body">
          <div className="col-xs-12 col-sm-10">
            <Input
              name={`quota-${item.id}-title`}
              value={item.title}
              label="Kiintiön nimi"
              type="text"
              required
              onChange={(field, value) => this.updateQuota(item.id, 'title', value)}
            />
            <Input
              name={`quota-${item.id}-max-attendees`}
              value={item.max_attendees}
              label="Kiintiön koko"
              type="number"
              required
              validations="isInt"
              min={0}
              onChange={(field, value) => this.updateQuota(item.id, 'max_attendees', value)}
            />
          </div>
          <div className="col-xs-12 col-sm-2">
            <a onClick={() => this.removeQuota(item.id)}>Poista</a>
          </div>
        </div>
      );
    });

    return <SortableItems collection="quotas" items={q} onSortEnd={this.updateOrder} useDragHandle />;
  }

  renderQuotaSection() {
    if (this.state.data.useQuotas) {
      return (
        <div>
          {this.renderQuotas()}
          <a className="btn btn-primary pull-right" onClick={this.addQuota}>Lisää kiintiö</a>
          <div className="clearfix" />
          <Checkbox
            name="useOpenQuota"
            value={this.state.data.useOpenQuota}
            label="Käytä lisäksi yhteistä kiintiötä"
            onChange={this.handleChange} />
          {
            (!this.state.data.useOpenQuota ||
              <Input name="open-quota-size" label="Avoimen kiintiön koko" type="number" required />
            )
          }
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div>
        <Input
          name="registration_start_date"
          value=""
          label="Ilmo alkaa"
          type="datetime-local"
          required
          onChange={this.handleChange}
        />
        <Input
          name="registration_end_date"
          value=""
          label="Ilmo päättyy"
          type="datetime-local"
          required
          onChange={this.handleChange}
        />
        <hr />
        <Checkbox
          name="useQuotas"
          value={this.state.data.useQuotas}
          label="Ilmoittautumisessa käytetään kiintiöitä"
          rowLabel="Kiintiöt"
          onChange={this.handleChange}
        />
        {this.renderQuotaSection()}
      </div>
    );
  }
}

export default QuotasTab;
