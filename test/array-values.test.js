import {
  fixture,
  assert,
  html,
  nextFrame
} from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon';
import '../api-property-form-item.js';

describe('<api-property-form-item>', function() {
  async function basicFixture() {
    return (await fixture(html `<api-property-form-item></api-property-form-item>`));
  }

  describe('Array values', function() {
    let element;
    let model;
    beforeEach(async () => {
      element = await basicFixture();
      model = {
        schema: {
          isArray: true,
          inputType: 'number',
          minimum: 2,
          maximum: 20
        }
      };
      element.model = model;
      await nextFrame();
    });

    it('isEnum is false', function() {
      assert.isFalse(element._isEnum);
    });

    it('isInput is false', function() {
      assert.isFalse(element._isInput);
    });

    it('isArray is true', function() {
      assert.isTrue(element._isArray);
    });

    it('isBoolean is false', function() {
      assert.isFalse(element._isBoolean);
    });

    it('arrayValue is computed', function() {
      assert.typeOf(element._arrayValue, 'array');
    });

    it('Dropdowns are not rendered', function() {
      const node = element.shadowRoot.querySelector('anypoint-dropdown-menu');
      assert.notOk(node);
    });

    it('<label> for array values is rendered', function() {
      const node = element.shadowRoot.querySelector('label');
      assert.ok(node);
    });

    it('Has no inputs', function() {
      const nodes = element.shadowRoot.querySelectorAll('anypoint-input');
      assert.lengthOf(nodes, 0);
    });

    it('Will not pass validation for invalid value', async () => {
      element.addEmptyArrayValue();
      element._arrayValue[0].value = 1;
      element._arrayValue = [...element._arrayValue];
      await nextFrame();
      assert.isFalse(element.validate());
    });

    it('Will pass validation for valid value', async () => {
      element.addEmptyArrayValue();
      element._arrayValue[0].value = 2;
      element._arrayValue = [...element._arrayValue];
      await nextFrame();
      assert.isTrue(element.validate());
    });

    it('Adds action button adds new input', async () => {
      const node = element.shadowRoot.querySelector('.add-action anypoint-button');
      node.click();
      await nextFrame();

      const nodes = element.shadowRoot.querySelectorAll('.array-item');
      assert.lengthOf(nodes, 1);
    });

    it('Sets value from array input', async () => {
      element.addEmptyArrayValue();
      await nextFrame();
      const node = element.shadowRoot.querySelector('.array-item anypoint-input');
      node.value = 'test';
      node.dispatchEvent(new CustomEvent('input'));
      assert.lengthOf(element.value, 1);
      assert.equal(element.value[0], 'test');
    });

    it('Removes value when button click', async () => {
      element.addEmptyArrayValue();
      element.addEmptyArrayValue();
      await nextFrame();
      const node = element.shadowRoot.querySelector('.array-item anypoint-icon-button');
      node.click();
      await nextFrame();
      const nodes = element.shadowRoot.querySelectorAll('.array-item');
      assert.lengthOf(nodes, 1);
    });

    it('adds new value on button click', async () => {
      const button = element.shadowRoot.querySelector('.add-action anypoint-button');
      MockInteractions.tap(button);
      await nextFrame();
      const nodes = element.shadowRoot.querySelectorAll('.array-item');
      assert.lengthOf(nodes, 1);
    });

    it('adds new value on icon click', async () => {
      const button = element.shadowRoot.querySelector('.add-action .icon');
      MockInteractions.tap(button);
      await nextFrame();
      const nodes = element.shadowRoot.querySelectorAll('.array-item');
      assert.lengthOf(nodes, 1);
    });

    it('creates array value from string when changing type', () => {
      element._isInput = true;
      element._isArray = false;
      element.value = 'test';
      element._isInput = false;
      element._isArray = true;
      assert.deepEqual(element._arrayValue, [{ value: 'test' }]);
    });

    it('silently ignores invalid remove', () => {
      element.addEmptyArrayValue();
      element._removeArrayValue({
        currentTarget: document.createElement('span')
      });
      assert.lengthOf(element._arrayValue, 1);
    });
  });

  describe('compatibility mode', () => {
    it('sets compatibility on item when setting legacy', async () => {
      const element = await basicFixture();
      element.legacy = true;
      assert.isTrue(element.legacy, 'legacy is set');
      assert.isTrue(element.compatibility, 'compatibility is set');
    });

    it('returns compatibility value from item when getting legacy', async () => {
      const element = await basicFixture();
      element.compatibility = true;
      assert.isTrue(element.legacy, 'legacy is set');
    });
  });

  describe('Array values: a11y', () => {
    let model;
    beforeEach(() => {
      model = {
        schema: {
          isArray: true,
          inputType: 'number',
          minimum: 2,
          maximum: 20
        },
        value: ['value 1', 'value 2']
      };
    });

    it('is accessible with values', async () => {
      const element = await basicFixture();
      element.model = model;
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible when disabled', async () => {
      const element = await basicFixture();
      element.model = model;
      element.readOnly = true;
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible when outlined', async () => {
      const element = await basicFixture();
      element.model = model;
      element.outlined = true;
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible when compatibility', async () => {
      const element = await basicFixture();
      element.model = model;
      element.compatibility = true;
      await nextFrame();
      await assert.isAccessible(element);
    });
  });

  describe('input event', () => {
    let element;
    let model;
    beforeEach(async () => {
      element = await basicFixture();
      model = {
        schema: {
          isArray: true,
          inputType: 'number',
          minimum: 2,
          maximum: 20
        }
      };
      element.model = model;
      await nextFrame();
    });

    it('dispatches retargeted input event', async () => {
      const inputValue = 'test-input';
      element.addEmptyArrayValue();
      await nextFrame();
      const node = element.shadowRoot.querySelector('.array-item anypoint-input');
      node.value = inputValue;
      const spy = sinon.spy();
      element.addEventListener('input', spy);
      node.dispatchEvent(new CustomEvent('input'));
      assert.isTrue(spy.called, 'event is dispatched');
      assert.equal(spy.args[0][0].target.value, inputValue, 'target has value');
    });
  });
});
