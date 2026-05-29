# Testing Guide (Days 24–26)

Source: *30 Days of React* by Nate Murray

---

## Testing Stack

| Tool | Purpose |
|------|---------|
| **Jest** | Test runner + assertions. Built into CRA. |
| **Enzyme** | React component rendering for unit/integration tests. |
| **Nightwatch** | End-to-end browser automation via Selenium. |

---

## Jest Basics (Day 24)

CRA includes Jest. Run: `npm test`.

### Test file naming
- `MyComponent.test.js` — co-located with component
- `__tests__/MyComponent.js` — in tests folder

### Basic test structure
```js
describe('MyComponent', () => {
  it('renders without crashing', () => {
    // test here
  });

  it('shows the correct text', () => {
    // another test
  });
});
```

### Matchers
```js
expect(value).toBe(42);                  // strict equality
expect(value).toEqual({ a: 1 });         // deep equality
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(array).toContain('item');
expect(fn).toThrow();
expect(fn).toHaveBeenCalled();
```

### Testing pure functions
```js
// utils.js
export const add = (a, b) => a + b;

// utils.test.js
import { add } from './utils';

describe('add()', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  it('handles negatives', () => {
    expect(add(-1, 1)).toBe(0);
  });
});
```

---

## Enzyme (Day 25)

### Setup
```bash
npm install --save-dev enzyme enzyme-adapter-react-16
```

```js
// src/setupTests.js (CRA auto-loads this)
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
```

### shallow() — Unit Tests
- Renders the component **without** rendering child components.
- Fast, isolated, ideal for testing one component at a time.

```jsx
import { shallow } from 'enzyme';
import Header from './Header';

describe('<Header />', () => {
  it('renders an h1 with the title', () => {
    const wrapper = shallow(<Header title="Hello" />);
    expect(wrapper.find('h1').text()).toBe('Hello');
  });

  it('applies the correct className', () => {
    const wrapper = shallow(<Header title="Test" />);
    expect(wrapper.find('.header').length).toBe(1);
  });
});
```

### mount() — Integration Tests
- Renders the **full component tree** including children.
- Requires a DOM environment (Jest uses jsdom).
- Use when testing component interactions, lifecycle hooks, refs.

```jsx
import { mount } from 'enzyme';
import App from './App';

describe('<App />', () => {
  it('renders Header and Content children', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find(Header).length).toBe(1);
    expect(wrapper.find(Content).length).toBe(1);
  });

  it('updates state on button click', () => {
    const wrapper = mount(<Counter />);
    wrapper.find('button').simulate('click');
    expect(wrapper.state('count')).toBe(1);
  });
});
```

### Common Enzyme API
```js
wrapper.find('div')          // find by tag
wrapper.find('.class-name')  // find by class
wrapper.find(MyComponent)    // find by component
wrapper.text()               // get text content
wrapper.prop('title')        // get a prop value
wrapper.state('key')         // get state value
wrapper.simulate('click')    // simulate browser event
wrapper.setProps({ x: 1 })   // update props
wrapper.instance()           // access component instance
wrapper.update()             // sync enzyme after setState
```

### Testing stateful components
```jsx
describe('<Clock />', () => {
  it('initializes with current time in state', () => {
    const wrapper = shallow(<Clock />);
    expect(wrapper.state('hours')).toBeDefined();
    expect(wrapper.state('minutes')).toBeDefined();
  });

  it('calls updateClock after 1 second', () => {
    jest.useFakeTimers();
    const wrapper = mount(<Clock />);
    jest.runTimersToTime(1000);
    expect(wrapper.state('seconds')).toBeDefined();
    jest.useRealTimers();
  });
});
```

### Testing with mocked props
```jsx
describe('<ActivityItem />', () => {
  const mockActivity = {
    actor: { display_login: 'user1', avatar_url: 'http://img.jpg' },
    repo: { name: 'user1/my-repo' },
    payload: { action: 'started' },
    created_at: new Date().toISOString()
  };

  it('renders actor name', () => {
    const wrapper = shallow(<ActivityItem activity={mockActivity} />);
    expect(wrapper.find('p').text()).toContain('user1');
  });
});
```

---

## Nightwatch — End-to-End Testing (Day 26)

Nightwatch automates a real browser via Selenium WebDriver.

### Install
```bash
npm install --save-dev nightwatch selenium-server chromedriver
```

### Config (nightwatch.json)
```json
{
  "src_folders": ["tests/e2e"],
  "webdriver": {
    "start_process": true,
    "server_path": "node_modules/.bin/selenium-server"
  },
  "test_settings": {
    "default": {
      "desiredCapabilities": {
        "browserName": "chrome"
      }
    }
  }
}
```

### Writing E2E tests
```js
// tests/e2e/homepage.js
module.exports = {
  'Home page loads and shows title': function(browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('h1', 'Timeline')
      .end();
  },

  'Search input accepts text': function(browser) {
    browser
      .url('http://localhost:3000')
      .setValue('input[type=text]', 'hello')
      .assert.value('input[type=text]', 'hello')
      .end();
  }
};
```

### Running
```bash
# Start your React dev server first
npm start
# In another terminal:
npm run e2e
```

---

## Testing Strategy Summary

| Test Type | Tool | When to Use |
|-----------|------|-------------|
| Unit | Jest | Pure functions, utility logic |
| Component (shallow) | Enzyme shallow | Individual component render, props |
| Component (full) | Enzyme mount | Lifecycle, children, interactions |
| End-to-end | Nightwatch | Full user flow through browser |

**Rule of thumb from the book:**
- Test every component renders without crashing.
- Test that props flow correctly.
- Test user interactions that trigger state changes.
- Use E2E sparingly — they're slow but catch real integration bugs.
