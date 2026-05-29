# 30 Days of React — Full Curriculum Reference

Source: *30 Days of React* by Nate Murray (Fullstack.io, 2020)

---

## Days 1–2: What is React? JSX Basics

### Day 1 — What is React?
- React is a JavaScript **library** (not a framework) for building user interfaces — it is the **view layer**.
- Core idea: **components** — self-contained modules that render output. Components are composable.
- React uses a **Virtual DOM**: changes are reconciled in memory first, then React updates only the parts of the real DOM that changed (efficient diffing).
- Data management is strict: React uses props and state to make UIs predictable.

**Minimal Hello World:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.min.js"></script>
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
<div id="app"></div>
<script type="text/babel">
  ReactDOM.render(<h1>Hello world</h1>, document.querySelector('#app'));
</script>
```

### Day 2 — JSX and ES6
- **ES5** = classic JavaScript; **ES6** = modern JS (2015) with classes, arrow functions, destructuring.
- **JSX** = JavaScript Extension — lets you write HTML-like syntax inside JavaScript.
- JSX compiles to `React.createElement()` calls:
  ```jsx
  // JSX
  <h1 className='large'>Hello World</h1>
  // Compiled
  React.createElement('h1', {className: 'large'}, 'Hello World')
  ```
- Reserved word conflicts: use `className` (not `class`), `htmlFor` (not `for`).
- **Babel** transpiles ES6+JSX → ES5 for browser compatibility.

---

## Days 3–4: Components

### Day 3 — First Component
- Define components using ES6 class syntax:
  ```jsx
  class App extends React.Component {
    render() {
      return <h1>Hello from our app</h1>;
    }
  }
  ReactDOM.render(<App />, document.querySelector('#app'));
  ```
- Every component **must** have a `render()` method that returns JSX.
- Use custom components like HTML elements: `<App />`, `<Header />`.

### Day 4 — Complex / Nested Components
- Break large UIs into smaller single-concern components.
- **Parent component** contains **child components**.
- JSX comments: `{/* this is a comment */}` — NOT `<!-- HTML comment -->`.
- Example: `<App>` → `<Header>` + `<Content>` → `<ActivityItem>`.
- `className` is used throughout — never `class` in JSX.

**Container pattern:**
```jsx
class App extends React.Component {
  render() {
    return (
      <div className="notificationsFrame">
        <div className="panel">
          <Header />
          <Content />
        </div>
      </div>
    );
  }
}
```

---

## Days 5–7: Props, State, Lifecycle

### Day 5 — Props (Data-Driven Components)
- **Props** = external data passed into a component. Read-only inside the component.
- Pass props like HTML attributes: `<Header title="Timeline" />`.
- Access via `this.props.title` inside the class.
- Props can be strings, numbers, booleans, objects, arrays, or functions.
- **Dynamic rendering with `.map()`:**
  ```jsx
  {this.props.activities.map(activity => (
    <ActivityItem key={activity.id} activity={activity} />
  ))}
  ```
- Always provide a unique `key` prop when rendering lists.

### Day 6 — State
- **State** = internal data managed by the component itself.
- Initialize in constructor: `this.state = { count: 0 }`.
- Update with `this.setState({ count: this.state.count + 1 })` — NEVER mutate directly.
- `setState` triggers a re-render.
- State is private — child components don't know about it unless passed as props.

**Clock example (stateful):**
```jsx
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getTime();
  }
  getTime() {
    const t = new Date();
    return { hours: t.getHours(), minutes: t.getMinutes(), seconds: t.getSeconds() };
  }
  componentDidMount() {
    this.timeout = setTimeout(() => this.updateClock(), 1000);
  }
  updateClock() {
    this.setState(this.getTime());
    this.timeout = setTimeout(() => this.updateClock(), 1000);
  }
  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }
  render() {
    const { hours, minutes, seconds } = this.state;
    return <p>{hours}:{minutes}:{seconds}</p>;
  }
}
```

### Day 7 — Lifecycle Hooks
- `componentDidMount()` — fires after component mounts. Best place for API calls, timers.
- `componentWillMount()` — fires just before mounting (legacy, use componentDidMount instead).
- `componentWillReceiveProps(nextProps)` — fires when parent passes new props. Compare `nextProps` to current to decide if action needed.
- `componentWillUpdate()` — fires before re-render. Don't call `setState` here (infinite loop).
- `componentDidUpdate()` — fires after re-render with new props/state.
- `componentWillUnmount()` — fires before removal. Clean up timers, event listeners, WebSockets.

**Fetch data on mount:**
```jsx
componentDidMount() {
  fetch('https://api.github.com/events')
    .then(r => r.json())
    .then(data => this.setState({ activities: data.slice(0, 4) }));
}
```

---

## Days 8–9: PropTypes and Packaging

### Day 8 — PropTypes
- PropTypes document and validate the types of props a component expects.
- Import: `import PropTypes from 'prop-types'` (or via CDN script tag).
- Define after the class:
  ```jsx
  Header.propTypes = {
    title: PropTypes.string.isRequired,
    count: PropTypes.number,
    isOn: PropTypes.bool,
    onClick: PropTypes.func,
    items: PropTypes.array,
    user: PropTypes.object,
  };
  ```
- Collection types: `PropTypes.arrayOf(PropTypes.number)`, `PropTypes.oneOf(['Red', 'Blue'])`.
- Shape: `PropTypes.shape({ name: PropTypes.string, age: PropTypes.number })`.
- Setting `.isRequired` makes React warn if the prop is missing.

### Day 9 — Reusable Components
- Encapsulate: move components into their own files/modules.
- `defaultProps` sets fallback values: `Header.defaultProps = { title: 'Default Title' }`.
- Good component design = one responsibility, documented API via PropTypes.

---

## Days 10–11: create-react-app and Stateless Components

### Day 10 — create-react-app (CRA)
```bash
npx create-react-app my-app
cd my-app
npm start   # dev server at localhost:3000
npm run build  # production build
```
- Handles Babel, Webpack, hot reload, and Jest out of the box.
- File structure: `src/`, `public/`, `node_modules/`.
- Import CSS: `import './App.css'`.
- Import images: `import logo from './logo.png'`.

### Day 11 — Stateless Functional Components (Pure Components)
- When a component has no state or lifecycle hooks, write as a function:
  ```jsx
  const Header = (props) => (
    <div className="header">
      <h1>{props.title}</h1>
    </div>
  );
  // With ES6 destructuring:
  const Header = ({ title }) => <h1>{title}</h1>;
  ```
- Lighter weight than class components; easier to test.
- PropTypes still work: `Header.propTypes = { title: PropTypes.string }`.

---

## Days 12–14: Forms and Events

### Day 12 — Event Handling
- JSX events use camelCase: `onClick`, `onChange`, `onSubmit`, `onKeyDown`.
- Bind handlers to component: `onClick={this.handleClick.bind(this)}` or arrow function.
- Event object is React's SyntheticEvent (wraps native event, cross-browser).

```jsx
class Button extends React.Component {
  handleClick(e) {
    e.preventDefault();
    console.log('clicked');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click me</button>;
  }
}
```

### Day 13 — Controlled Forms
- **Controlled component**: form input value is driven by state.
- Every keystroke updates state, state drives the input value.
```jsx
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchTerm: '' };
  }
  handleChange(e) {
    this.setState({ searchTerm: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log('Searching for:', this.state.searchTerm);
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleChange.bind(this)}
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}
```

### Day 14 — Uncontrolled Forms + Refs
- **Uncontrolled component**: DOM manages its own state; React reads it via refs.
```jsx
class UncontrolledForm extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log(this.input.current.value);
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" ref={this.input} />
        <button>Submit</button>
      </form>
    );
  }
}
```

---

## Days 15–16: Promises and Fetch API

### Day 15 — Promises
- A Promise is an object representing an async operation's eventual result.
```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done!'), 1000);
});
p.then(result => console.log(result)).catch(err => console.error(err));
```
- **Chaining:** `.then()` returns a new Promise, enabling pipelines.
- **Promise.all:** runs multiple promises in parallel.

### Day 16 — Fetch API
- `fetch()` returns a Promise that resolves to a Response.
```jsx
componentDidMount() {
  fetch('https://api.github.com/users/auser/events')
    .then(response => {
      if (!response.ok) throw new Error('Network error');
      return response.json();
    })
    .then(data => this.setState({ activities: data }))
    .catch(err => this.setState({ error: err.message }));
}
```
- Always handle errors with `.catch()`.
- Show loading state while fetching: `this.state = { loading: true, data: [] }`.

---

## Days 17–18: React Router

### Day 17 — Client-Side Routing Setup
```bash
npm install react-router-dom
```
- **BrowserRouter** — wraps app, enables history API routing.
- **Route** — renders component when path matches.
- **Switch** — renders only the first matching Route.
- **Link** — renders `<a>` that doesn't reload page.

### Day 18 — Route Patterns
```jsx
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Router>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </nav>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/user/:id" component={UserProfile} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}
```
- **URL params** accessed via `this.props.match.params.id`.
- **Redirect:** `import { Redirect } from 'react-router-dom'` then `<Redirect to="/login" />`.

---

## Redux (Days 19–23)
→ See `redux-deep-dive.md` for full treatment.

**Summary:**
- Redux = global state management using Flux architecture.
- Three principles: Single source of truth (store), state is read-only, changes via pure functions (reducers).
- Flow: `dispatch(action)` → `reducer(state, action)` → new state → re-render.
- `createStore(reducer, initialState)` creates the store.
- `react-redux`: `<Provider store={store}>` at root, `connect(mapStateToProps, mapDispatchToProps)` wraps components.
- Middleware (e.g., for async): `createStore(reducer, initialState, applyMiddleware(apiMiddleware))`.

---

## Testing (Days 24–26)
→ See `testing-guide.md` for full treatment.

**Summary:**
- **Jest**: Built into CRA. Run with `npm test`. Use `describe()`, `it()`, `expect()`.
- **Enzyme**: `shallow()` for unit tests (no child rendering), `mount()` for integration tests.
- **Nightwatch + Selenium**: End-to-end browser testing (automated browser control).

---

## Deployment (Days 27–30)

### Webpack
- Bundles all JS, CSS, images into optimized static files.
- CRA handles Webpack config automatically.
- `npm run build` → creates `build/` directory.

### Environment Variables
- Create `.env` file: `REACT_APP_API_KEY=abc123`.
- Access in code: `process.env.REACT_APP_API_KEY`.
- REACT_APP_ prefix is required by CRA.

### Deploying to surge.sh
```bash
npm install --global surge
npm run build
cd build
surge
# Follow prompts: choose domain like myapp.surge.sh
```

### Other deployment targets
- **GitHub Pages**: `npm install gh-pages`, add scripts to package.json.
- **Netlify**: Drag-and-drop `build/` folder or connect GitHub repo.
- **Vercel**: `npx vercel` from project root.
