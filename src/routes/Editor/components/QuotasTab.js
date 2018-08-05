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
    event: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.addQuota = this.addQuota.bind(this);
    this.updateQuota = this.updateQuota.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
  }

  addQuota() {
    const quotas = this.props.event.quota ? this.props.event.quota : [];
    const newQuotas = _.concat(quotas, {
      id: (_.max(quotas.map(n => n.id)) || 0) + 1,
      existsInDb: false,
      title: '',
      max_attendees: 0,
      registration_opens: new Date(),
      registration_closes: new Date(),
    });

    this.props.onDataChange('quota', newQuotas);
  }

  updateOrder(args) {
    let newQuotas = this.props.event.quota;

    const elementToMove = newQuotas[args.oldIndex];
    newQuotas.splice(args.oldIndex, 1);
    newQuotas.splice(args.newIndex, 0, elementToMove);

    // Update quota id's
    newQuotas = _.map(newQuotas, (quota, index) => {
      quota.id = index + 1;
      return quota;
    });

    this.props.onDataChange('quota', newQuotas);
  }

  updateQuota(itemId, field, value) {
    const quotas = this.props.event.quota ? this.props.event.quota : [];
    const newQuotas = _.map(quotas, (quota) => {
      if (quota.id === itemId) {
        return {
          ...quota,
          [field]: value,
        };
      }

      return quota;
    });

    this.props.onDataChange('quota', newQuotas);
  }

  removeQuota(itemId) {
    const quotas = this.props.event.quota ? this.props.event.quota : [];
    const newQuotas = _.filter(quotas, (quota) => {
      if (quota.id === itemId) {
        return false;
      }

      return true;
    });

    this.props.onDataChange('quota', newQuotas);
  }

  renderQuotas() {
    const q = _.map(this.props.event.quota, (item) => {
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
    if (this.props.event.useQuotas) {
      return (
        <div>
          {this.renderQuotas()}
          <a className="btn btn-primary pull-right" onClick={this.addQuota}>Lisää kiintiö</a>
          <div className="clearfix" />
          <Checkbox
            name="useOpenQuota"
            value={this.props.event.useOpenQuota}
            label="Käytä lisäksi yhteistä kiintiötä"
            onChange={this.props.onDataChange} />
          {
            (!this.props.event.useOpenQuota ||
              <Input
                name="openQuotaSize"
                label="Avoimen kiintiön koko"
                type="number"
                required
                onChange={this.props.onDataChange}
              />
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
          name="registrationStartDate"
          value=""
          label="Ilmo alkaa"
          type="datetime-local"
          required
          onChange={this.props.onDataChange}
        />
        <Input
          name="registrationEndDate"
          value=""
          label="Ilmo päättyy"
          type="datetime-local"
          required
          onChange={this.props.onDataChange}
        />
        <hr />
        <Checkbox
          name="useQuotas"
          value={this.props.event.useQuotas}
          label="Ilmoittautumisessa käytetään kiintiöitä"
          rowLabel="Kiintiöt"
          onChange={this.props.onDataChange}
        />
        {this.renderQuotaSection()}
      </div>
    );
  }
}

export default QuotasTab;
