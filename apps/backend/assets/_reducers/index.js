import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { messages } from "./messages.reducer";
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  authentication,
  messages,
  registration,
  alert
});

export default rootReducer;