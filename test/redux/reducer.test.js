import { expect } from 'chai';
import { fromJS } from 'immutable';
import C from '../../src/redux/constants';
import initialStateFixture from '../../src/redux/initial_state';
import reducer from '../../src/redux/reducer';
import { options } from '../fixtures/options';

describe('Reducer', () => {
  let initialState;
  let colorsInitialState;
  beforeEach(() => {
    initialState = fromJS(initialStateFixture);
    colorsInitialState = fromJS({
      colors: {
        isOpen: false,
        selected: [],
        searchTerm: '',
      },
    });
  });

  it('should return the initial state', () => {
    const action = {
      type: 'HELLO THERE',
    };
    expect(reducer(initialState, action))
      .to.deep.equal(initialState);
  });

  it(`should handle ${C.RSM_ADD_SELECT}`, () => {
    const action = {
      type: C.RSM_ADD_SELECT,
      data: { id: 'select' },
    };
    const reducedState = reducer(initialState, action);
    expect(reducedState.get(action.data.id))
      .to.equal(fromJS({ isOpen: false, selected: [], searchTerm: '' }));
  });

  it(`should handle ${C.RSM_REMOVE_SELECT}`, () => {
    const action = {
      type: C.RSM_REMOVE_SELECT,
      data: { id: 'colors' },
    };
    const reducedState = reducer(colorsInitialState, action);
    expect(reducedState).to.equal(fromJS(initialState));
  });

  it(`should handle ${C.RSM_TOGGLE_OPEN}`, () => {
    const action = {
      type: C.RSM_TOGGLE_OPEN,
      data: { id: 'colors', isOpen: true },
    };
    const reducedState = reducer(colorsInitialState, action);
    expect(reducedState.getIn(['colors', 'isOpen'])).to.equal(true);
  });

  it(`should handle ${C.RSM_SEARCH}`, () => {
    const action = {
      type: C.RSM_SAVE_SEARCH,
      data: { id: 'colors', searchTerm: 'Cookie Monster' },
    };
    const reducedState = reducer(colorsInitialState, action);
    expect(reducedState.getIn(['colors', 'searchTerm']))
      .to.equal('Cookie Monster');
  });

  it(`should handle ${C.RSM_SET_SELECTED}`, () => {
    const action = {
      type: C.RSM_SET_SELECTED,
      data: { id: 'colors', selected: fromJS(['Hotpink', 'Cyan']) },
    };
    const reducedState = reducer(colorsInitialState, action);
    expect(reducedState.getIn(['colors', 'selected']))
      .to.equal(fromJS(['Hotpink', 'Cyan']));
  });

  it(`should handle ${C.RSM_SET_OPTIONS}`, () => {
    const action = {
      type: C.RSM_SET_OPTIONS,
      data: { id: 'colors', options: fromJS(options) },
    };
    const reducedState = reducer(colorsInitialState, action);
    expect(reducedState.getIn(['colors', 'options']))
      .to.equal(fromJS(options));
  });
});
