import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, Checkbox } from 'formsy-react-components';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import DateTimePicker from './DateTimePicker';

const DragHandle = SortableHandle(() => <span className="handler" />); // This can be any component you want

const SortableItem = SortableElement(({ value }) => (
  <div className="panel panel-default">
    <DragHandle />
    {value}
  </div>
));

const SortableItems = SortableContainer(({ collection, items }) => (
  <div>
    {items.map((value, index) => (
      <SortableItem collection={collection} key={index} index={index} value={value} />
    ))}
  </div>
));

class QuotasTab extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
  };

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
      title: '',
      existsInDb: false,
    });

    this.props.onDataChange('quota', newQuotas);
  }

  updateOrder(args) {
    let newQuotas = this.props.event.quota;
    const elementToMove = newQuotas[args.oldIndex];
    newQuotas.splice(args.oldIndex, 1);
    newQuotas.splice(args.newIndex, 0, elementToMove);

    this.props.onDataChange('quota', newQuotas);
  }

  updateQuota(itemId, field, value) {
    const quotas = this.props.event.quota ? this.props.event.quota : [];

    const newQuotas = _.map(quotas, (quota) => {
      if (quota.id === itemId) {
        if (field === "size" && value === '') {
          return {
            ...quota,
            [field]: null,
          };
        }
        else {
          return {
            ...quota,
            [field]: value,
          };
        }

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
    const q = _.map(this.props.event.quota, (item, index) => (
      <div className="panel-body">
        <div className="col-xs-12 col-sm-10">
          <Input
            name={`quota-${item.id}-title`}
            value={item.title}
            label="Kiintiön nimi"
            type="text"
            required
            onChange={(field, value) => this.updateQuota(item.id, 'title', value)}
            help={
              index === 0
                ? 'Jos kiintiöitä on vain yksi, voit antaa sen nimeksi esim. tapahtuman nimen. Voit järjestellä kiintiöitä raahaamalla niitä vasemmalta.'
                : null
            }
          />
          <Input
            name={`quota-${item.id}-max-attendees`}
            value={item.size}
            label="Kiintiön koko"
            type="number"
            validations="isInt"
            min={0}
            onChange={(field, value) => this.updateQuota(item.id, 'size', value)}
            help="Jos kiintiön kokoa ole rajoitettu määrää, jätä kenttä tyhjäksi."
          />
        </div>
        {index > 0 ? (
          <div className="col-xs-12 col-sm-2">
            <a onClick={() => this.removeQuota(item.id)}>Poista</a>
          </div>
        ) : null}
      </div>
    ));

    return <SortableItems collection="quotas" items={q} onSortEnd={this.updateOrder} useDragHandle />;
  }

  renderQuotaSection() {
    return (
      <div>
        {this.renderQuotas()}
        <div className="text-center">
          <a className="btn btn-primary" onClick={this.addQuota}>
            Lisää kiintiö
          </a>
        </div>
        <div className="clearfix" />
        <Checkbox
          name="useOpenQuota"
          value={this.props.event.useOpenQuota}
          label="Käytä lisäksi yhteistä kiintiötä"
          onChange={this.props.onDataChange}
        />
        {!this.props.event.useOpenQuota || (
          <Input
            name="openQuotaSize"
            label="Avoimen kiintiön koko"
            type="number"
            value={this.props.event.openQuotaSize}
            required
            onChange={this.props.onDataChange}
          />
        )}
      </div>
    );
  }

  render() {
    return (
      <div>
        <DateTimePicker
          name="registrationStartDate"
          value={this.props.event.registrationStartDate}
          label="Ilmo alkaa"
          required
          onChange={this.props.onDataChange}
        />
        <DateTimePicker
          name="registrationEndDate"
          value={this.props.event.registrationEndDate}
          label="Ilmo päättyy"
          required
          onChange={this.props.onDataChange}
        />
        <hr />
        {this.renderQuotaSection()}
      </div>
    );
  }
}

export default QuotasTab;
