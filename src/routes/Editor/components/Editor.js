import React from 'react';
import Formsy from 'formsy-react';
import { Checkbox, CheckboxGroup, Input, RadioGroup, Row, Select, File, Textarea } from 'formsy-react-components';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import './Editor.scss';

const DragHandle = SortableHandle(() => <span className="handler"></span>); // This can be any component you want

const SortableItem = SortableElement(({ value }) =>
  <div className="panel panel-default">
    <DragHandle/>
    {value}
  </div>);

const SortableItems = SortableContainer(({ items }) => {
  return (
    <div>
      { items.map((value, index) => <SortableItem key={index} index={index} value={value} />) }
    </div>
  );
});

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 2,
      useQuotas: true,
      useOpenQuota: false,
      eventData: {
        quotas: [
          {
            title: 'Kiintiö 1',
            max_attendees: 20,
            registration_opens: new Date(),
            registration_closes: new Date(),
          },
          {
            title: 'Kiintiö 2',
            max_attendees: 10,
            registration_opens: new Date(),
            registration_closes: new Date(),
          }
        ],
      },
    };

    this.changeTab = this.changeTab.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.toggleQuotas = this.toggleQuotas.bind(this);
    this.addQuota = this.addQuota.bind(this);
    this.removeQuota = this.removeQuota.bind(this);
    this.toggleOpenQuota = this.toggleOpenQuota.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentWillMount() {
    // this.props.getAdminEventList()
  }

  changeTab(id) {
    const state = this.state;
    state.activeTab = id;
    this.setState(state);
  }

  toggleQuotas() {
    const state = this.state;
    state.useQuotas = !state.useQuotas;
    this.setState(state);
  }

  addQuota() {
    const state = this.state;
    state.eventData.quotas.push({
      title: '',
      max_attendees: null,
      registration_opens: new Date(),
      registration_closes: new Date(),
    });
    this.setState(state);
  }

  removeQuota(id) {
    const state = this.state;
    delete state.eventData.quotas[id];
    this.setState(state);
  }


  toggleOpenQuota() {
    const state = this.state;
    state.useOpenQuota = !state.useOpenQuota;
    this.setState(state);
  }

  updateOrder(args) {
    const state = this.state;

    // Move quota to new position
    const elementToMove = this.state.eventData.quotas[args.oldIndex];
    state.eventData.quotas.splice(args.oldIndex, 1);
    state.eventData.quotas.splice(args.newIndex, 0, elementToMove);

    this.setState(state);
  }

  submitForm(model) {
    console.log(model);
  }

  render() {
    const quotas = this.state.eventData.quotas.map((item, index) =>
      <div className="panel-body">
        <div className="col-xs-12 col-sm-10">
          <Input name={`quota-${index}-title`} value={ item.title } label="Kiintiön nimi" type="text" required />
          <Input name={`quota-${index}-max-size`} value={ item.max_attendees } label="Kiintiön koko" type="number" required />
        </div>
        <div className="col-xs-12 col-sm-2">
          <Checkbox name="quotas" value={false} label="Pakollinen" />
          <Checkbox name="quotas" value={false} label="Julkinen" />
          <a onClick={() => this.removeQuota(index)}>Poista</a>
        </div>
      </div>,
    );
    return (
      <Formsy.Form
        onSubmit={this.submitForm}
        className="event-editor form-horizontal col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
        <h1>Luo uusi tapahtuma</h1>
        <input className="btn btn-success pull-right" formNoValidate={true} type="submit" defaultValue="Tallenna" />
        <ul className="nav nav-tabs">
          <li className={`${(this.state.activeTab === 1 ? 'active' : '')}`}>
            <a onClick={() => this.changeTab(1)}>Perustiedot</a>
          </li>
          <li className={`${(this.state.activeTab === 2 ? 'active' : '')}`}>
            <a onClick={() => this.changeTab(2)}>Ilmoittautumisasetukset</a>
          </li>
          <li className={`${(this.state.activeTab === 3 ? 'active' : '')}`}>
            <a onClick={() => this.changeTab(3)}>Kysymykset</a>
          </li>
          <li className={`${(this.state.activeTab === 4 ? 'active' : '')}`}>
            <a onClick={() => this.changeTab(4)}>Vahvistusviestit</a>
          </li>
        </ul>
        <div className="tab-content">
          <div className={`tab-pane ${(this.state.activeTab === 1 ? 'active' : '')}`}>
            <Input name="title" value="" label="Tapahtuman nimi" type="text" required />
            <Input name="start_date" value="" label="Alkamisajankohta" type="datetime-local" />
            <Input name="end_date" value="" label="Päättymisajankohta" type="datetime-local" />
            <Input name="webpage_url" value="" label="Kotisivujen osoite" type="text" />
            <Input name="facebook_url" value="" label="Facebook-tapahtuma" type="text" />
            <Input name="location" value="" label="Paikka" type="text" />
            <Textarea rows={10} name="kuvaus" value="" label="Kuvaus" />
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 2 ? 'active' : '')}`}>
            <Input name="registration_start_date" value="" label="Ilmo alkaa" type="datetime-local" required />
            <Input name="registration_end_date" value="" label="Ilmo päättyy" type="datetime-local" required />
            <hr />
            <Checkbox name="quotas"
              value={false}
              label="Ilmoittautumisessa käytetään kiintiöitä"
              rowLabel="Kiintiöt"
              onChange={this.toggleQuotas} />
            {
              (!this.state.useQuotas ||
                <div>
                  <SortableItems items={quotas} onSortEnd={this.updateOrder} useDragHandle />
                  <a className="btn btn-primary pull-right" onClick={this.addQuota}>Lisää kiintiö</a>
                  <div className="clearfix" />
                  <Checkbox name="quotas"
                    value={false}
                    label="Käytä lisäksi yhteistä kiintiötä"
                    rowLabel="asd"
                    onChange={this.toggleOpenQuota} />
                  {
                    (!this.state.useOpenQuota ||
                      <Input name={`open-quota-size`} label="Avoimen kiintiön koko" type="number" required />
                    )
                  }
                </div>)
            }


          </div>
          <div className={`tab-pane ${(this.state.activeTab === 3 ? 'active' : '')}`}>
            asd
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 4 ? 'active' : '')}`}>
            asd
          </div>
        </div>
      </Formsy.Form>
    );
  }
}

export default Editor
