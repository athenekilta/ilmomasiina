import React from 'react';
import Formsy from 'formsy-react';
import _ from 'lodash';
import { Checkbox, Input, Select, Textarea } from 'formsy-react-components';
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
    { items.map((value, index) => <SortableItem collection={collection} key={index} index={index} value={value} />) }
  </div>,
);

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      useQuotas: true,
      useOpenQuota: false,
      eventData: {
        questions: [],
        quotas: [],
      },
    };

    this.changeTab = this.changeTab.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.toggleQuotas = this.toggleQuotas.bind(this);
    this.addQuota = this.addQuota.bind(this);
    this.removeQuota = this.removeQuota.bind(this);
    this.toggleOpenQuota = this.toggleOpenQuota.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  changeTab(id) {
    const state = this.state;
    state.activeTab = id;
    this.setState(state);
  }

  updateState(dataType, itemId, field, value) {
    const state = this.state;
    switch (dataType) {
      case 'question':
        (_.find(state.eventData.questions, { id: itemId }))[field] = value;
        break;
      case 'quota':
        (_.find(state.eventData.quotas, { id: itemId }))[field] = value;
        break;
      default:
        break;
    }
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
      id: (_.max(state.eventData.quotas.map(n => n.id)) || 0) + 1,
      existsInDb: false,
      title: '',
      max_attendees: 10,
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

  addQuestion() {
    const state = this.state;
    state.eventData.questions.push({
      id: (_.max(state.eventData.questions.map(n => n.id)) || 0) + 1,
      existsInDb: false,
      title: '',
      type: 'text',
    });
    this.setState(state);
  }

  removeQuestion(id) {
    const state = this.state;
    delete state.eventData.questions[id];
    this.setState(state);
  }

  toggleOpenQuota() {
    const state = this.state;
    state.useOpenQuota = !state.useOpenQuota;
    this.setState(state);
  }

  updateOrder(args) {
    // General method for moving array items
    const moveElement = (array, from, to) => {
      const elementToMove = array[from];
      array.splice(from, 1);
      array.splice(to, 0, elementToMove);
      return array;
    };

    const state = this.state;

    // Move quota or question to new position
    switch (args.collection) {
      case 'quotas':
        state.eventData.quotas = moveElement(state.eventData.quotas, args.oldIndex, args.newIndex);
        break;
      case 'questions':
        state.eventData.questions = moveElement(state.eventData.questions, args.oldIndex, args.newIndex);
        break;
      default:
        break;
    }

    this.setState(state);
  }

  submitForm(model) {
    console.log(model);
  }

  render() {
    const quotas = this.state.eventData.quotas.map((item, index) =>
      <div className="panel-body">
        <div className="col-xs-12 col-sm-10">
          <Input
            name={`quota-${item.id}-title`}
            value={item.title}
            label="Kiintiön nimi"
            type="text"
            required
            onChange={(field, value) => this.updateState('quota', item.id, 'title', value)}
          />
          <Input
            name={`quota-${item.id}-max-attendees`}
            value={item.max_attendees}
            label="Kiintiön koko"
            type="number"
            required
            onChange={(field, value) => this.updateState('quota', item.id, 'max_attendees', value)}
          />
        </div>
        <div className="col-xs-12 col-sm-2">
          <a onClick={() => this.removeQuota(index)}>Poista</a>
        </div>
      </div>);

    const questionTypes = [
      { value: 'text', label: 'Teksti (lyhyt)' },
      { value: 'textarea', label: 'Teksti (pitkä)' },
      { value: 'number', label: 'Numero' },
      { value: 'select', label: 'Monivalinta (voi valita yhden)' },
      { value: 'checkbox', label: 'Monivalinta (voi valita monta)' },
    ];

    const questions = this.state.eventData.questions.map((item, index) =>
      <div className="panel-body">
        <div className="col-xs-12 col-sm-10">
          <Input
            name={`question-${item.id}-title`}
            value={item.title}
            label="Kysymys"
            type="text"
            required
            onChange={(field, value) => this.updateState('question', item.id, 'title', value)}
          />
          <Select
            name={`question-${item.id}-type`}
            value={item.type}
            label="Tyyppi"
            options={questionTypes}
            onChange={(field, value) => this.updateState('question', item.id, 'type', value)}
            required
          />
        </div>
        <div className="col-xs-12 col-sm-2">
          <Checkbox
            name={`question-${item.id}-required`}
            value={false}
            label="Pakollinen"
            onChange={(field, value) => this.updateState('question', item.id, 'required', value)}
          />
          <Checkbox
            name={`question-${item.id}-public`}
            value={false}
            label="Julkinen"
            onChange={(field, value) => this.updateState('question', item.id, 'public', value)}
          />
          <a onClick={() => this.removeQuestion(index)}>Poista</a>
        </div>
      </div>);

    return (
      <Formsy.Form
        onSubmit={this.submitForm}
        className="event-editor form-horizontal col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
        <h1>Luo uusi tapahtuma</h1>
        <input className="btn btn-success pull-right" formNoValidate type="submit" defaultValue="Tallenna" />
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
            <Textarea rows={10} name="description" value="" label="Kuvaus" />
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
                  <SortableItems collection="quotas" items={quotas} onSortEnd={this.updateOrder} useDragHandle />
                  <a className="btn btn-primary pull-right" onClick={this.addQuota}>Lisää kiintiö</a>
                  <div className="clearfix" />
                  <Checkbox name="quotas"
                    value={false}
                    label="Käytä lisäksi yhteistä kiintiötä"
                    rowLabel="asd"
                    onChange={this.toggleOpenQuota} />
                  {
                    (!this.state.useOpenQuota ||
                      <Input name="open-quota-size" label="Avoimen kiintiön koko" type="number" required />
                    )
                  }
                </div>)
            }
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 3 ? 'active' : '')}`}>
            <p>Kaikilta osallistujilta kerätään aina nimi ja sähköpostiosoite.</p>
            <div>
              <SortableItems collection="questions" items={questions} onSortEnd={this.updateOrder} useDragHandle />
              <a className="btn btn-primary pull-right" onClick={this.addQuestion}>Lisää kysymys</a>
            </div>
          </div>
          <div className={`tab-pane ${(this.state.activeTab === 4 ? 'active' : '')}`}>
            <Textarea rows={10} name="verification" value="" label="Vahvistusviesti sähköpostiin" />
          </div>
        </div>
      </Formsy.Form>
    );
  }
}

export default Editor;
