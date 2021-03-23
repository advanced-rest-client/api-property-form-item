import {
  fixture,
  assert,
  html,
  nextFrame
} from '@open-wc/testing';
import * as sinon from 'sinon';
import '../api-property-form-item.js';

describe('<api-property-form-item>', () => {
  async function basicFixture() {
    return fixture(html `<api-property-form-item></api-property-form-item>`);
  }

  describe('String values', () => {
    let element;
    let model;
    beforeEach(async () => {
      element = await basicFixture();
      model = {
        required: true,
        schema: {
          inputLabel: 'Enter value',
          pattern: '[a-zA-Z0-9_]*',
          inputPlaceholder: 'This is the placeholder'
        }
      };
      element.model = model;
      await nextFrame();
    });

    it('isEnum is false', () => {
      assert.isFalse(element._isEnum);
    });

    it('isInput is true', () => {
      assert.isTrue(element._isInput);
    });

    it('isArray is false', () => {
      assert.isFalse(element._isArray);
    });

    it('isBoolean is false', () => {
      assert.isFalse(element._isBoolean);
    });

    it('arrayValue is undefined', () => {
      assert.isUndefined(element._arrayValue);
    });

    it('Dropdown is not rendered', () => {
      const {shadowRoot} = element;
      const menu = shadowRoot.querySelector('anypoint-dropdown-menu');
      assert.notOk(menu);
    });

    it('Input type is string', () => {
      const {shadowRoot} = element;
      const node = shadowRoot.querySelector('anypoint-input');
      assert.equal(node.type, model.schema.inputType);
    });

    it('Passing inputLabel model property', () => {
      const {shadowRoot} = element;
      const node = shadowRoot.querySelector('anypoint-input label');
      const value = node.innerText.trim();
      assert.equal(value, model.schema.inputLabel);
    });

    it('Passing pattern model property', () => {
      const {shadowRoot} = element;
      const node = shadowRoot.querySelector('anypoint-input');
      assert.equal(node.pattern, model.schema.pattern);
    });

    it('Passing required model property', () => {
      const {shadowRoot} = element;
      const node = shadowRoot.querySelector('anypoint-input');
      assert.isFalse(node.required);
    });

    it('Passing inputPlaceholder model property', () => {
      const {shadowRoot} = element;
      const node = shadowRoot.querySelector('anypoint-input');
      assert.equal(node.placeholder, model.schema.inputPlaceholder);
    });

    it('Will not pass validation for invalid value', async () => {
      element.value = 't e s t';
      await nextFrame();
      assert.isFalse(element.validate());
    });

    it('passes validation for valid value', async () => {
      element.value = 'test';
      await nextFrame();
      assert.isTrue(element.validate());
    });

    it('passes outlined style property', async () => {
      element.outlined = true;
      await nextFrame();
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isTrue(input.outlined, 'dropdown has the property');
    });

    it('passes compatibility style property', async () => {
      element.compatibility = true;
      await nextFrame();
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isTrue(input.compatibility, 'dropdown has the property');
    });

    it('input event passes value to the element', async () => {
      const input = element.shadowRoot.querySelector('anypoint-input');
      input.value = 'test value';
      input.dispatchEvent(new CustomEvent('input'));
      assert.equal(element.value, 'test value');
    });
  });

  describe('String values: a11y', () => {
    let model;
    beforeEach(() => {
      model = {
        required: true,
        schema: {
          inputLabel: 'Enter value',
          pattern: '[a-zA-Z0-9_]*',
          inputPlaceholder: 'This is the placeholder'
        }
      };
    });

    it('is accessible', async () => {
      const element = await basicFixture();
      element.model = model;
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible when invalid', async () => {
      const element = await basicFixture();
      element.model = model;
      element.value = 't e s t';
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible when disabled', async () => {
      const element = await basicFixture();
      element.model = model;
      element.readOnly = true;
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible when outlined', async () => {
      const element = await basicFixture();
      element.model = model;
      element.outlined = true;
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible when compatibility', async () => {
      const element = await basicFixture();
      element.model = model;
      element.compatibility = true;
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });
  });

  describe('input event', () => {
    let element;
    let model;
    beforeEach(async () => {
      element = await basicFixture();
      model = {
        required: true,
        schema: {
          inputLabel: 'Enter value',
          inputPlaceholder: 'This is the placeholder'
        }
      };
      element.model = model;
      await nextFrame();
    });

    it('dispatches retargeted input event', async () => {
      const spy = sinon.spy();
      element.addEventListener('input', spy);
      const input = element.shadowRoot.querySelector('anypoint-input');
      input.value = 'test-value';
      input.dispatchEvent(new CustomEvent('input'));
      assert.isTrue(spy.called, 'event is dispatched');
      assert.equal(spy.args[0][0].target.value, 'test-value', 'target has value');
    });
  });

  describe('required text input', () => {
    let element = null;
    let model;

    beforeEach(async () => {
      element = await basicFixture();
      model = {
        name: '',
        value: undefined,
        schema: {
          required: true,
          inputLabel: 'Enter value',
        }
      };
      element.model = model;
      await nextFrame();
    });

    it('should not set required if schema is required without minLength nor pattern', () => {
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isNotTrue(input.required);
    });

    it('should show warning message if schema is required without minLength nor pattern', () => {
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isUndefined(input.infoMessage);
    });

    it('should set required if schema is required with minLength', async () => {
      model = { ...model, schema: { ...model.schema, minLength: 1 } };
      element.model = model;
      await nextFrame();
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isTrue(input.required);
    });

    it('should not show warning message if schema is required with minLength', async () => {
      model = { ...model, schema: { ...model.schema, minLength: 1 } };
      element.model = model;
      await nextFrame();
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isUndefined(input.infoMessage);
    });

    it('should set required if schema is required with pattern', async () => {
      model = { ...model, schema: { ...model.schema, pattern: '[a-zA-Z0-9_]*' } };
      element.model = model;
      await nextFrame();
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isTrue(input.required);
    });

    it('should not show warning message if schema is required with pattern', async () => {
      model = { ...model, schema: { ...model.schema, pattern: '[a-zA-Z0-9_]*' } };
      element.model = model;
      await nextFrame();
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isUndefined(input.infoMessage);
    });

    it('should not set required if schema is not required with minLength', async () => {
      model = { ...model, schema: { ...model.schema, minLength: 1, required: false } };
      element.model = model;
      await nextFrame();
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isNotTrue(input.required);
    });

    it('should not set required if schema is not required with pattern', async () => {
      model = { ...model, schema: { ...model.schema, pattern: '[a-zA-Z0-9_]*', required: false } };
      element.model = model;
      await nextFrame();
      const input = element.shadowRoot.querySelector('anypoint-input');
      assert.isNotTrue(input.required);
    });
  });
});
