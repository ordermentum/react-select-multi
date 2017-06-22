// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import wrapWithClickout from 'react-clickout';
import { fromJS } from 'immutable';

import SelectSearchBase from './SelectSearchBase';
import {
  addSelect,
  toggleOpen,
  saveSelected,
  saveSearch,
  removeSelect,
  saveOptionsUI,
  removeOptionUI,
} from '../redux/actions';

import type { Options, Selected, Callback, Styles, DefaultStyles } from '../types';

type SelectConnectedProps = {
  // config
  id: string,
  isMultipleSelect: boolean,
  isSearchable: boolean,

  // data / appearance
  label: string,
  placeholder: string,
  options: Options,
  initialSelected: Array<string>,
  styles: Styles,

  // methods
  toggleOpen: Callback,
  addSelect: Callback,
  saveSelected: Callback,
  removeSelect: Callback,
  handleSearch: Callback,
  saveOptionsUI: Callback,
  removeOptionUI: Callback,

  // dynamic
  isOpen: boolean,
  selected: Selected,
  searchTerm: string,
};

type SelectConnectedDefaultProps = {
  // config
  isMultipleSelect: false,
  isSearchable: false,

  // data / appearance
  label: '',
  placeholder: '',
  styles: DefaultStyles,

  // dynamic
  isOpen: false,
  searchTerm: '',
};

export class SelectSearchConnectedComponent extends Component {
  defaultProps: SelectConnectedDefaultProps;
  props: SelectConnectedProps;

  componentDidMount() {
    const { id } = this.props;
    this.props.addSelect({ id });
  }

  componentWillReceiveProps(nextProps: SelectConnectedProps) {
    // if (nextProps.initialSelected.length !== this.props.initialSelected.length) {
    //   this.props.saveSelected({ id, selected: initialSelected });
    // }
    // if (nextProps.options.size && !this.props.options[0].get('id') !== nextProps.options[0].get('id')) {
    //   console.log('OK!!!!!!!!!!!!!!!');
    //   this.props.saveOptionsUI({ id: nextProps.id, optionsUI: nextProps.options });
    // }
  }

  componentWillUnmount() {
    const { id } = this.props;
    this.props.removeSelect({ id });
  }

  handleAdd = (option) => () => {
    const { id, selected } = this.props;
    let updatedSelected = [];
    // console.log('option:', option);
    const toAdd = fromJS({
      id: option.get('id'),
      display: option.get('display'),
    });
    updatedSelected = selected.push(toAdd);
    this.props.saveSelected({ id, selected: updatedSelected });

    this.props.handleSearch(this.props.searchTerm, [option.get('id')]);
  }

  handleRemove = (option) => () => {
    const { id, selected } = this.props;
    const updatedSelected = selected.filter(s => s.get('id') !== option.get('id'));
    this.props.saveSelected({ id, selected: updatedSelected });
    this.props.handleSearch(this.props.searchTerm);
  }

  onToggleOpen = () => {
    this.props.toggleOpen({ id: this.props.id, isOpen: !this.props.isOpen });
  }

  handleClickout = () => {
    console.log('we are in handleClickout');
    if (!this.props.isOpen) return;
    this.props.toggleOpen({ id: this.props.id, isOpen: false });
  }

  handleSearch = (searchTerm) => {
    if (!this.props.isOpen) {
      this.props.toggleOpen({ id: this.props.id, isOpen: true });
    }
    this.props.saveSearch({ id: this.props.id, searchTerm });
    this.props.handleSearch(searchTerm);
  }

  render() {
    return (
      <SelectSearchBase
        id={this.props.id}
        isMultipleSelect={this.props.isMultipleSelect}
        isSearchable={this.props.isSearchable}
        label={this.props.label}
        placeholder={this.props.placeholder}
        options={this.props.optionsUI}
        styles={this.props.styles}
        toggleOpen={this.onToggleOpen}
        handleAdd={this.handleAdd}
        handleRemove={this.handleRemove}
        isOpen={this.props.isOpen}
        selected={this.props.selected}
        searchTerm={this.props.searchTerm}
        handleSearch={this.handleSearch}
      />);
  }
}

const mapStateToProps = (state, ownProps) => ({
  isOpen: state.select.getIn([ownProps.id, 'isOpen']),
  selected: state.select.getIn([ownProps.id, 'selected']),
  optionsUI: state.select.getIn([ownProps.id, 'optionsUI']),
  searchTerm: state.select.getIn([ownProps.id, 'searchTerm']),
});

const mapDispatchToProps = {
  addSelect,
  toggleOpen,
  saveSelected,
  saveSearch,
  removeSelect,
  saveOptionsUI,
  removeOptionUI,
};

// const Wrapped = wrapWithClickout(SelectSearchConnectedComponent);
const Wrapped = wrapWithClickout(SelectSearchConnectedComponent);

const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);
// const connected = connect(mapStateToProps, mapDispatchToProps)(SelectSearchConnectedComponent);

export default connected;
