import {
  fixture,
  assert,
  html,
  nextFrame
} from '@open-wc/testing';
import * as sinon from 'sinon';
import '../api-property-form-item.js';

describe('<api-property-form-item>', function() {
  async function basicFixture() {
    return (await fixture(html `<api-property-form-item></api-property-form-item>`));
  }

  describe('Number values', function() {
    let element;
    let model;
    beforeEach(async () => {
      element = await basicFixture();
      model = {
        schema: {
          inputType: 'number',
          minimum: 10,
          maximum: 100
        }
      };
      element.model = model;
      await nextFrame();
    });

    it('isEnum is false', function() {
      assert.isFalse(element._isEnum);
    });

    it('isInput is true', function() {
      assert.isTrue(element._isInput);
    });

    it('isArray is false', function() {
      assert.isFalse(element._isArray);
    });

    it('isBoolean is false', function() {
      assert.isFalse(element._isBoolean);
    });

    it('arrayValue is undefined', function() {
      assert.isUndefined(element._arrayValue);
    });

    it('Dropdown is not rendered', function() {
      const shadowRoot = element.shadowRoot;
      const menu = shadowRoot.querySelector('anypoint-dropdown-menu');
      assert.notOk(menu);
    });

    it('Input type is number', function() {
      const shadowRoot = element.shadowRoot;
      const node = shadowRoot.querySelector('anypoint-input');
      assert.equal(node.type, model.schema.inputType);
    });

    it('Passing minimum model property', function() {
      const shadowRoot = element.shadowRoot;
      const node = shadowRoot.querySelector('anypoint-input');
      assert.ok(node.min);
      assert.equal(node.min, model.schema.minimum);
    });

    it('Passing maximum model property', function() {
      const shadowRoot = element.shadowRoot;
      const node = shadowRoot.querySelector('anypoint-input');
      assert.ok(node.max);
      assert.equal(node.max, model.schema.maximum);
    });

    it('Will not pass validation for invalid value', async () => {
      element.value = 1;
      await nextFrame();
      assert.isFalse(element.validate());
    });

    it('passes validation for valid value', async () => {
      element.value = 10;
      await nextFrame();
      assert.isTrue(element.validate());
    });
  });

  describe('Number values: a11y', () => {
    let model;
    beforeEach(() => {
      model = {
        schema: {
          inputType: 'number',
          inputLabel: 'test label',
          minimum: 10,
          maximum: 100
        }
      };
    });

    it('is accessible in normal state', async () => {
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
      element.value = 1;
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
        schema: {
          inputType: 'number',
          minimum: 10,
          maximum: 100
        }
      };
      element.model = model;
      await nextFrame();
    });

    it('dispatches retargeted input event', async () => {
      const inputValue = 15;
      await nextFrame();
      const node = element.shadowRoot.querySelector('anypoint-input');
      node.value = inputValue;
      const spy = sinon.spy();
      element.addEventListener('input', spy);
      node.dispatchEvent(new CustomEvent('input'));
      assert.isTrue(spy.called, 'event is dispatched');
      assert.equal(spy.args[0][0].target.value, inputValue, 'target has value');
    });

    it('dispatches input event on change', async () => {
      const inputValue = 15;
      await nextFrame();
      const node = element.shadowRoot.querySelector('anypoint-input');
      node.value = inputValue;
      const spy = sinon.spy();
      element.addEventListener('input', spy);
      node.dispatchEvent(new CustomEvent('change'));
      assert.isTrue(spy.called, 'event is dispatched');
      assert.equal(spy.args[0][0].target.value, inputValue, 'target has value');
    });
  });
});
