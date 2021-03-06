// @flow
import { fromJS } from 'immutable';
import C from './constants';
import initialState from './initial_state';

import type { Action, DataState, Reducer } from '../types';


const reducer: Reducer = (state: DataState = fromJS(initialState), action: Action) => {
  switch (action.type) {
    /* --- REACT SELECT MULTI ------------------------ */
    case C.RSM_ADD_SELECT: {
      const { id } = action.data;
      if (!id) return state;
      return state.merge({
        [id]: { isOpen: false, selected: [], searchTerm: '', options: [] },
      });
    }

    case C.RSM_REMOVE_SELECT: {
      const { id } = action.data;
      return state.delete(id);
    }

    /* --- TOGGLE ------------------------ */
    case C.RSM_TOGGLE_OPEN: {
      const { id, isOpen } = action.data;
      return state.mergeIn([id, 'isOpen'], isOpen);
    }

    /* --- SEARCH ------------------------ */
    case C.RSM_SAVE_SEARCH: {
      const { id, searchTerm } = action.data;
      return state.setIn([id, 'searchTerm'], searchTerm);
    }

    /* --- SELECTED ------------------------ */
    case C.RSM_SET_SELECTED: {
      const { id, selected } = action.data;
      // use setIn because we providing the entire new dataset to replace state
      return state.setIn([id, 'selected'], selected);
    }

    case C.RSM_CLEAR_SELECTED: {
      const { id } = action.data;
      return state.setIn([id, 'selected'], fromJS([]));
    }

    /* --- OPTIONS ------------------------ */
    case C.RSM_SET_OPTIONS: {
      const { id, options } = action.data;
      // use setIn because we providing the entire new dataset to replace state
      return state.setIn([id, 'options'], options);
    }

    case C.RSM_CLEAR_OPTIONS: {
      const { id } = action.data;
      return state.setIn([id, 'options'], fromJS([]));
    }

    case C.RSM_MERGE_OPTIONS: {
      // this will merge in the new List, checking for duplicates
      const { id, options } = action.data;
      const existing = state.getIn([id, 'options']);
      const updated = existing.toOrderedSet().union(options.toOrderedSet()).toList();
      const merged = state.setIn([id, 'options'], updated);
      return merged;
    }

    /* --- Single Item (Option / Selected) ------------------------ */
    case C.RSM_ADD_ITEM: {
      const { id, item, addTo } = action.data;
      const existing = state.getIn([id, addTo]);
      const updated = existing.toOrderedSet().add(item).toList();
      const merged = state.setIn([id, addTo], updated);
      return merged;
    }

    case C.RSM_REMOVE_ITEM: {
      const { id, item, removeFrom } = action.data;
      const existing = state.getIn([id, removeFrom]);
      const updated = existing.toOrderedSet().remove(item).toList();
      const merged = state.setIn([id, removeFrom], updated);
      return merged;
    }

    default: {
      return state;
    }
  }
};

export default reducer;
