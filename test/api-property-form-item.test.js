import {
  fixture,
  assert,
  html,
  nextFrame
} from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../api-property-form-item.js';

describe('<api-property-form-item>', function() {
  async function basicFixture() {
    return (await fixture(html `<api-property-form-item></api-property-form-item>`));
  }

  async function nilFixture() {
    return (await fixture(html `<api-property-form-item value="test"></api-property-form-item>`));
  }

  describe('Basics', function() {
    it('_isInput is default value without the model', async () => {
      const element = await basicFixture();
      assert.isTrue(element._isInput);
    });
  });

  describe('_getInputElement()', () => {
    it('returns anypoint-input for text types', async () => {
      const element = await basicFixture();
      element.model = {
        schema: {
          inputType: 'text'
        }
      };
      await nextFrame();
      const result = element._getInputElement();
      assert.ok(result);
      assert.equal(result.nodeName, 'ANYPOINT-INPUT');
    });

    it('returns anypoint-dropdown-menu for enum type', async () => {
      const element = await basicFixture();
      element.model = {
        schema: {
          inputType: 'text',
          isEnum: true,
          enum: ['apple', 'banana', 'cherries']
        }
      };
      await nextFrame();
      const result = element._getInputElement();
      assert.ok(result);
      assert.equal(result.nodeName, 'ANYPOINT-DROPDOWN-MENU');
    });

    it('returns anypoint-dropdown-menu for boolean type', async () => {
      const element = await basicFixture();
      element.model = {
        value: 'true',
        schema: {
          inputType: 'text',
          isBool: true,
        }
      };
      await nextFrame();
      const result = element._getInputElement();
      assert.ok(result);
      assert.equal(result.nodeName, 'ANYPOINT-DROPDOWN-MENU');
    });

    it('returns nodes list for array type', async () => {
      const element = await basicFixture();
      element.model = {
        required: false,
        name: 'test',
        value: ['a', 'b'],
        schema: {
          isArray: true
        }
      };
      await nextFrame();
      const result = element._getInputElement();
      assert.lengthOf(result, 2);
    });
  });

  describe('_nillableChanged()', () => {
    let element;
    let button;

    beforeEach(async () => {
      element = await nilFixture();
      element.model = {
        schema: {
          inputType: 'text',
          isNillable: true
        }
      };
      await nextFrame();
      button = element.shadowRoot.querySelector('.nil-option');
    });

    it('disables the input when nil is enabled', async () => {
      MockInteractions.tap(button);
      await nextFrame();
      const input = element._getInputElement();
      assert.isTrue(input.disabled);
    });

    it('Re-enables the input', async () => {
      MockInteractions.tap(button);
      await nextFrame();
      MockInteractions.tap(button);
      await nextFrame();
      const input = element._getInputElement();
      assert.isFalse(input.disabled);
    });

    it('Sets _nilEnabled property when nil enabled', () => {
      MockInteractions.tap(button);
      assert.isTrue(element._nilEnabled);
    });

    it('Sets _nilEnabled property when nil disabled', async () => {
      MockInteractions.tap(button);
      await nextFrame();
      MockInteractions.tap(button);
      assert.isFalse(element._nilEnabled);
    });

    it('Sets _oldNilValue property', () => {
      MockInteractions.tap(button);
      assert.equal(element._oldNilValue, 'test');
    });

    it('Clears _oldNilValue property', async () => {
      MockInteractions.tap(button);
      await nextFrame();
      MockInteractions.tap(button);
      assert.isUndefined(element._oldNilValue);
    });

    it('Sets value to nil', () => {
      MockInteractions.tap(button);
      assert.equal(element.value, 'nil');
    });

    it('Re-sets value', async () => {
      MockInteractions.tap(button);
      await nextFrame();
      MockInteractions.tap(button);
      assert.equal(element.value, 'test');
    });

    it('Re-sets empty value', async () => {
      element.value = '';
      MockInteractions.tap(button);
      await nextFrame();
      MockInteractions.tap(button);
      assert.equal(element.value, '');
    });
  });

  describe('_defaultValidator()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns true when no model', () => {
      const result = element._defaultValidator();
      assert.isTrue(result);
    });

    it('Returns true when no value and not required', () => {
      element.model = {
        required: false,
        name: 'test',
        value: '',
        schema: {}
      };
      const result = element._defaultValidator();
      assert.isTrue(result);
    });

    it('Returns true when value and required', () => {
      element.model = {
        required: true,
        name: 'test',
        value: 'test',
        schema: {}
      };
      const result = element._defaultValidator();
      assert.isTrue(result);
    });

    it('Returns false when no value and required', () => {
      element.model = {
        required: true,
        name: 'test',
        value: '',
        schema: {}
      };
      const result = element._defaultValidator();
      assert.isFalse(result);
    });
  });

  describe('_itemsForArray()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns array from string input', () => {
      const result = element._itemsForArray('test');
      assert.deepEqual(result, [{
        value: 'test'
      }]);
    });

    it('Returns array from array input', () => {
      const result = element._itemsForArray(['test']);
      assert.deepEqual(result, [{
        value: 'test'
      }]);
    });
  });

  describe('_prepareArraySchema()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets _isArray', () => {
      const model = {
        required: false,
        name: 'test',
        value: '',
        schema: {
          isArray: true
        }
      };
      element._prepareArraySchema(model);
      assert.isTrue(element._isArray);
    });

    it('Sets default value when model value is not an array', () => {
      const model = {
        required: false,
        name: 'test',
        value: '',
        schema: {
          isArray: true
        }
      };
      element._prepareArraySchema(model);
      assert.deepEqual(element._arrayValue, []);
    });

    it('Sets value from the model', () => {
      const model = {
        required: false,
        name: 'test',
        value: ['a', 'b'],
        schema: {
          isArray: true
        }
      };
      element._prepareArraySchema(model);
      assert.deepEqual(element._arrayValue, [{
        value: 'a'
      }, {
        value: 'b'
      }]);
    });
  });
});
