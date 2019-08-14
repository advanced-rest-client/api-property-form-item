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

  describe('Boolean values', function() {
    let element;
    let model;
    beforeEach(async () => {
      element = await basicFixture();
      model = {
        schema: {
          inputType: 'string',
          isBool: true
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

    it('isArray is false', function() {
      assert.isFalse(element._isArray);
    });

    it('isBoolean is true', function() {
      assert.isTrue(element._isBoolean);
    });

    it('arrayValue is undefined', function() {
      assert.isUndefined(element._arrayValue);
    });

    it('Dropdown is rendered', function() {
      const shadowRoot = element.shadowRoot;
      const menu = shadowRoot.querySelector('anypoint-dropdown-menu');
      assert.equal(menu.dataset.type, 'boolean');
    });

    it('Has no inputs', function() {
      const nodes = element.shadowRoot.querySelectorAll('anypoint-input');
      assert.lengthOf(nodes, 0);
    });

    it('Always passes validation', function() {
      assert.isTrue(element.validate());
    });

    it('sets boolean false value from list selection', () => {
      const item = element.shadowRoot.querySelector('anypoint-item[data-value="false"]');
      MockInteractions.tap(item);
      assert.equal(element.value, false);
    });

    it('sets boolean true value from list selection', () => {
      const item = element.shadowRoot.querySelector('anypoint-item[data-value="true"]');
      MockInteractions.tap(item);
      assert.equal(element.value, true);
    });

    it('passes outlined style property', async () => {
      element.outlined = true;
      await nextFrame();
      const menu = element.shadowRoot.querySelector('anypoint-dropdown-menu');
      assert.isTrue(menu.outlined, 'dropdown has the property');
    });

    it('passes legacy style property', async () => {
      element.legacy = true;
      await nextFrame();
      const menu = element.shadowRoot.querySelector('anypoint-dropdown-menu');
      assert.isTrue(menu.legacy, 'dropdown has the property');
      const listbox = element.shadowRoot.querySelector('anypoint-listbox');
      assert.isTrue(listbox.legacy, 'listbox has the property');
    });
  });

  describe('Boolean values: a11y', () => {
    let model;
    beforeEach(() => {
      model = {
        schema: {
          inputType: 'string',
          isBool: true
        }
      };
    });

    it('is accessible', async () => {
      const element = await basicFixture();
      element.model = model;
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible when disabled', async () => {
      const element = await basicFixture();
      element.model = model;
      element.readonly = true;
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

    it('is accessible when legacy', async () => {
      const element = await basicFixture();
      element.model = model;
      element.legacy = true;
      await nextFrame();
      await assert.isAccessible(element);
    });
  });
});
