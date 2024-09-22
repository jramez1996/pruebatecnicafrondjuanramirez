import { createStore, combineReducers } from "redux";

import todo from "./reducer";

const reducer = combineReducers({
  state: todo
});

export default createStore(reducer);