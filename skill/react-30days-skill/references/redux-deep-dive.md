# Redux Deep Dive (Days 19–23)

Source: *30 Days of React* by Nate Murray

---

## Core Concepts

Redux follows the **Flux architecture**: unidirectional data flow.

```
View → dispatch(action) → Reducer(state, action) → New State → View
```

### Three Principles
1. **Single source of truth** — one store holds all app state.
2. **State is read-only** — only dispatch actions to change it.
3. **Pure reducer functions** — `(state, action) => newState`. No side effects.

---

## Day 19 — Reducers and Store

### Reducer
```js
// src/redux/reducers.js
const initialState = {
  currentTime: new Date().toString()
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_NEW_TIME':
      return { ...state, currentTime: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
```

### Creating the Store
```js
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

// Inspect state:
console.log(store.getState());

// Subscribe to changes:
store.subscribe(() => console.log('State changed:', store.getState()));
```

### Action Types (constants)
```js
// src/redux/types.js
export const FETCH_NEW_TIME = 'FETCH_NEW_TIME';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
```

### Action Creators
```js
// src/redux/actionCreators.js
import * as types from './types';

export const updateTime = () => ({
  type: types.FETCH_NEW_TIME,
  payload: new Date().toString()
});

export const login = (user) => ({
  type: types.LOGIN,
  payload: user
});

export const logout = () => ({
  type: types.LOGOUT
});
```

### Dispatching Actions
```js
store.dispatch(updateTime());
store.dispatch(login({ name: 'Abhista', role: 'admin' }));
```

---

## Day 20 — Connecting Redux to React

### Install react-redux
```bash
npm install redux react-redux
```

### Provider (wrap your whole app)
```jsx
// src/index.js
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducers';
import App from './App';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### connect() — wire a component to Redux store
```jsx
// src/components/Home.js
import { connect } from 'react-redux';
import { updateTime } from '../redux/actionCreators';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Current time: {this.props.currentTime}</h1>
        <button onClick={this.props.updateTime}>Update time</button>
      </div>
    );
  }
}

// Maps store state to component props
const mapStateToProps = (state) => ({
  currentTime: state.currentTime
});

// Maps dispatch to component props
const mapDispatchToProps = (dispatch) => ({
  updateTime: () => dispatch(updateTime())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
```

---

## Day 21 — combineReducers (Multiple Slices)

When state grows, split into domain-specific reducers:

```js
// src/redux/currentTime.js
import * as types from './types';

export const initialState = { currentTime: new Date().toString() };

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_NEW_TIME:
      return { ...state, currentTime: action.payload };
    default:
      return state;
  }
};
```

```js
// src/redux/currentUser.js
import * as types from './types';

export const initialState = { user: null, loggedIn: false };

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN:
      return { ...state, user: action.payload, loggedIn: true };
    case types.LOGOUT:
      return { ...state, user: null, loggedIn: false };
    default:
      return state;
  }
};
```

```js
// src/redux/reducers.js
import { combineReducers } from 'redux';
import { reducer as currentTime, initialState as timeState } from './currentTime';
import { reducer as currentUser, initialState as userState } from './currentUser';

export const rootReducer = combineReducers({
  time: currentTime,
  user: currentUser
});

export const initialState = {
  time: timeState,
  user: userState
};
```

```js
// src/redux/configureStore.js
import { createStore, combineReducers } from 'redux';
import { rootReducer, initialState } from './reducers';

export const configureStore = () => {
  return createStore(rootReducer, initialState);
};
```

**Accessing nested state in mapStateToProps:**
```js
const mapStateToProps = (state) => ({
  currentTime: state.time.currentTime,  // note: state.time not state
  user: state.user.user
});
```

---

## Redux Middleware (Day 21)

Middleware sits between `dispatch` and `reducer`. Signature:
```js
const myMiddleware = (store) => (next) => (action) => {
  // do something before action reaches reducer
  next(action); // pass action forward
  // do something after
};
```

### Logging Middleware (simplest example)
```js
// src/redux/loggingMiddleware.js
const loggingMiddleware = (store) => (next) => (action) => {
  console.log('Redux action:', action);
  next(action);
};

export default loggingMiddleware;
```

### Applying Middleware
```js
import { createStore, applyMiddleware } from 'redux';
import loggingMiddleware from './loggingMiddleware';

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(loggingMiddleware)
);
```

### API Middleware (async calls)
```js
// src/redux/apiMiddleware.js
const apiMiddleware = (store) => (next) => (action) => {
  if (!action.meta || action.meta.type !== 'api') {
    return next(action); // not an API action, pass through
  }

  const { url } = action.meta;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      store.dispatch({
        type: action.type,
        payload: data
      });
    });
};

export default apiMiddleware;
```

**Action creator that triggers API middleware:**
```js
export const fetchNewTime = (timezone = 'pst') => ({
  type: types.FETCH_NEW_TIME,
  payload: null,
  meta: {
    type: 'api',
    url: `https://andthetimeis.com/${timezone}/now.json`
  }
});
```

---

## Redux File Structure (recommended)

```
src/
├── redux/
│   ├── types.js           (action type constants)
│   ├── actionCreators.js  (action creator functions)
│   ├── currentTime.js     (slice: initialState + reducer)
│   ├── currentUser.js     (slice: initialState + reducer)
│   ├── reducers.js        (combineReducers root)
│   ├── configureStore.js  (createStore with middleware)
│   ├── loggingMiddleware.js
│   └── apiMiddleware.js
├── components/
│   └── Home.js            (connected with connect())
└── index.js               (Provider wraps App)
```
