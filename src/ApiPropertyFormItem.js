/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { html, LitElement } from 'lit-element';
import { ValidatableMixin } from '@anypoint-web-components/validatable-mixin';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import { addCircleOutline, removeCircleOutline } from  '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import styles from './Styles.js';

/** @typedef {import('@anypoint-web-components/anypoint-input').AnypointInput} AnypointInput *
/** @typedef {import('@anypoint-web-components/anypoint-dropdown-menu').AnypointDropdownMenu} AnypointDropdownMenu *
/** @typedef {import('@api-components/api-view-model-transformer').ModelItem} ModelItem *

/**
 * An element that renders a form input to edit API type value.
 *
 * This element is to replace deprecated `raml-type-form-input` that has
 * the same functionality but works with RAML data only.
 *
 * **If you need an element that works with Polymer 1.0, use old `raml-type-form-input` element**
 *
 * It accepts ARC view model generated by either `api-headers-editor`
 * or `api-url-data-model`. The model is generated using
 * `api-view-model-transformer` that transforms AMF `json/ld` API model
 * into data model consumable by ARC UI elements.
 *
 * Also, use mixins and variables for `anypoint-input`, `paper-dropdown-menu`,
 * `anypoint-listbox`, and `anypoint-item` to style this element.
 */
export class ApiPropertyFormItem extends ValidatableMixin(LitElement) {
  get styles() {
    return styles;
  }

  _enumTemplate() {
    const { model, name, readOnly, disabled, value, outlined, compatibility, _nilEnabled } = this;
    const values = model.schema.enum || [];
    return html`
    <anypoint-dropdown-menu
      name="${name}"
      ?required="${!_nilEnabled && model.required}"
      autoValidate
      data-type="enum"
      ?disabled="${readOnly || disabled || _nilEnabled}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
    >
      <label slot="label">${model.schema.inputLabel}</label>
      <anypoint-listbox
        slot="dropdown-content"
        attrforselected="data-value"
        .selected="${value}"
        ?compatibility="${compatibility}"
        @selected-changed="${this._listSelectionHandler}"
      >
        ${values.map((item) => html`<anypoint-item data-value="${item}">${item}</anypoint-item>`)}
      </anypoint-listbox>
    </anypoint-dropdown-menu>`;
  }

  _booleanTemplate() {
    const { name, readOnly, disabled, value, outlined, compatibility, _nilEnabled } = this;
    const viewModel = /** @type ModelItem */ (this.model);
    if (!viewModel) {
      return '';
    }

    const bindValue = (value === true || value === 'true') ? 'true' : 'false';
    return html`
    <anypoint-dropdown-menu
      name="${name}"
      ?required="${!_nilEnabled && viewModel.required}"
      autoValidate
      data-type="boolean"
      ?disabled="${readOnly || disabled || _nilEnabled}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
    >
      <label slot="label">${viewModel.schema.inputLabel}</label>
      <anypoint-listbox
        slot="dropdown-content"
        attrforselected="data-value"
        .selected="${bindValue}"
        ?compatibility="${compatibility}"
        @selected-changed="${this._listSelectionHandler}"
      >
        <anypoint-item data-value="true">True</anypoint-item>
        <anypoint-item data-value="false">False</anypoint-item>
      </anypoint-listbox>
    </anypoint-dropdown-menu>`;
  }

  _inputTemplate() {
    const { name, noLabelFloat, readOnly, disabled, value, outlined, compatibility, _nilEnabled, _valueWarningMessage } = this;
    const viewModel = /** @type ModelItem */ (this.model);
    if (!viewModel) {
      return '';
    }
    const schema = viewModel.schema || {};
    const required = this._computeIsRequired(schema);
    return html`<anypoint-input
      .value="${value}"
      ?required="${!_nilEnabled && required}"
      .pattern="${schema.pattern}"
      .name="${name}"
      autoValidate
      .type="${schema.inputType}"
      .min="${schema.minimum}"
      .max="${schema.maximum}"
      .maxLength="${schema.maxLength}"
      .minLength="${schema.minLength}"
      .placeholder="${schema.inputPlaceholder}"
      ?noLabelFloat="${noLabelFloat}"
      ?readonly="${readOnly}"
      ?disabled="${disabled || _nilEnabled}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      data-type="input"
      @input="${this._inputHandler}"
      @change="${this._inputChangeHandler}"
      invalidMessage="${`${name} is invalid. Check documentation.`}"
      .infoMessage="${_valueWarningMessage}"
    >
      <label slot="label">${schema.inputLabel}</label>
    </anypoint-input>`;
  }

  _arrayTemplate() {
    const { name, readOnly, disabled, _arrayValue=[], outlined, compatibility, _nilEnabled, _arrayWarningMessages } = this;
    const viewModel = /** @type ModelItem */ (this.model);
    if (!viewModel) {
      return '';
    }
    const schema = viewModel.schema || {};
    const itemLabel = schema.inputLabel || 'Parameter value';
    return html`
    <label class="array-label">${itemLabel}</label>

    ${_arrayValue.map((item, index) => {
      const required = this._computeIsRequired(schema);
      const warningMessage = _arrayWarningMessages[index];
      return html`
    <div class="array-item">
      <anypoint-input
        .value="${item.value}"
        ?required="${!_nilEnabled && required}"
        .pattern="${schema.pattern}"
        .name="${name}"
        autoValidate
        .type="${schema.inputType}"
        .min="${schema.minimum}"
        .max="${schema.maximum}"
        .maxLength="${schema.maxLength}"
        .minLength="${schema.minLength}"
        noLabelFloat
        ?readonly="${readOnly}"
        ?disabled="${disabled || _nilEnabled}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        data-type="array"
        data-index="${index}"
        @input="${this._arrayValueHandler}"
        invalidMessage="${`${name} is invalid. Check documentation.`}"
        .infoMessage="${warningMessage}"
      >
        <label slot="label">${itemLabel}</label>
      </anypoint-input>
      ${index ? html`<anypoint-icon-button
        class="action-icon"
        data-index="${index}"
        ?compatibility="${compatibility}"
        @click="${this._removeArrayValue}"
        title="Remove array value"
        ?disabled="${this.readOnly || disabled}"
      >
        <span class="icon">${removeCircleOutline}</span>
      </anypoint-icon-button>` : undefined}
    </div>`;
    })}
    <div class="add-action">
      <anypoint-button
        @click="${this.addEmptyArrayValue}"
        title="Add an array value"
        ?disabled="${readOnly || disabled}"
        ?compatibility="${compatibility}"
      >
        <span class="icon action-icon">${addCircleOutline}</span>
        Add array value
      </anypoint-button>
    </div>
    `;
  }

  render() {
    const { readOnly, disabled, _isEnum, _isBoolean, _isInput, _isArray, _isNillable } = this;
    return html`<style>${this.styles}</style>
    <div class="content">
      ${_isEnum ? this._enumTemplate() : undefined}
      ${_isBoolean ? this._booleanTemplate() : undefined}
      ${_isInput ? this._inputTemplate() : undefined}
      ${_isArray ? this._arrayTemplate() : undefined}

      ${_isNillable ? html`<anypoint-checkbox
        ?disabled="${readOnly || disabled}"
        class="nil-option"
        @checked-changed="${this._nillableChanged}">Nil</anypoint-checkbox>` : undefined}
    </div>`;
  }

  static get properties() {
    return {
      /**
       * View model generated for this view.
       */
      model: { type: Object },
      /**
       * Name of the form item
       */
      name: { type: String, reflect: true },
      /**
       * When set, prohibits inputs to have floating labels
       */
      noLabelFloat: { type: Boolean },
      /**
       * Enables outlined theme.
       */
      outlined: { type: Boolean, reflect: true },
      /**
       * Enables compatibility with Anypoint components.
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * Input's value.
       */
      value: { type: String },
      // Computed value, True if current item is a dropdown with values.
      _isEnum: { type: Boolean },
      // Computed value, True if current item is an regular input
      _isInput: { type: Boolean },
      // Computed value, True if current item is an array object
      _isArray: { type: Boolean },
      // Computed value, True if current item is an union with nill value.
      _isNillable: { type: Boolean },

      _nilEnabled: { type: Boolean },
      // Computed value, True if current item is a boolean value
      _isBoolean: { type: Boolean },
      // A value of an array item (only if `isArray` is set)
      _arrayValue: { type: Array },
      /**
       * Set to indicate that the consol is required
       */
      required: { type: Boolean, reflect: true },
      /**
       * When set the editor is in read only mode.
       */
      readOnly: { type: Boolean },
      /**
       * When set the editor renders form controls disabled.
       */
      disabled: { type: Boolean },
      /**
       * Warning message for single text input value
       */
      _valueWarningMessage: { type: String },
       /**
        * Warning messages for array values
        */
      _arrayWarningMessages: { type: Array },
    };
  }

  get model() {
    return this._model;
  }

  set model(value) {
    const old = this._model;
    /* istanbul ignore if */
    if (value === old) {
      return;
    }
    this._model = value;
    this._modelChanged(value);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const old = this._value;
    /* istanbul ignore if */
    if (value === old) {
      return;
    }
    if (value === undefined || value === null || value === 'undefined') {
      value = '';
    }
    this._value = value;
    this.requestUpdate('value', old);
    this._isArrayChanged(this._isArray);
    const opts = {
      detail: {
        value
      }
    };
    this.dispatchEvent(new CustomEvent('changed', opts));
    this.dispatchEvent(new CustomEvent('value-changed', opts));
    this._updateValueWarningMessage();
  }

  get _isArray() {
    return this.__isArray;
  }

  set _isArray(value) {
    const old = this.__isArray;
    /* istanbul ignore if */
    if (value === old) {
      return;
    }
    this.__isArray = value;
    this._isArrayChanged(value);
    if (value) {
      this.setAttribute('isArray', '');
    } else {
      this.removeAttribute('isArray');
    }
  }

  get _isNillable() {
    return this.__isNillable;
  }

  set _isNillable(value) {
    const old = this.__isNillable;
    /* istanbul ignore if */
    if (value === old) {
      return;
    }
    this.__isNillable = value;
    if (value) {
      this.setAttribute('isNillable', '');
    } else {
      this.removeAttribute('isNillable');
    }
  }

  constructor() {
    super();
    this._isInput = true;
    this.value = '';
    this.compatibility = false;
    this.outlined = false;
    this.readOnly = false;
    this.disabled = false;
    this.noLabelFloat = false;
    this.name = undefined;
    this._arrayWarningMessages = [];
  }

  /**
   * Resets UI state variables
   */
  _resetStates() {
    this._isEnum = false;
    this._isInput = false;
    this._isArray = false;
    this._isBoolean = false;
    this._isNillable = false;
  }

  /**
   * Sets the template depending on model configuration
   * @param {ModelItem} model 
   */
  _modelChanged(model) {
    this._resetStates();
    if (!model) {
      return;
    }
    const { schema } = model;
    switch (true) {
      case schema.isEnum:
        this._isEnum = true;
        break;
      case schema.isArray:
        this._prepareArraySchema(model);
        break;
      case schema.isBool:
        this._isBoolean = true;
        break;
      default:
        this._isInput = true;
    }
    this._isNillable = !!schema.isNillable;
  }

  /**
   * Sets `arrayValue` from model's value.
   *
   * @param {ModelItem} model ARC amf view model.
   */
  _prepareArraySchema(model) {
    this._isArray = true;
    let value;
    if (model.value && Array.isArray(model.value)) {
      value = model.value.map((item) => ({
          value: item
        }));
    } else {
      value = [];
    }
    this._arrayValue = value;
    this._setWarningMessagesForArray(value);
  }

  // Sets array values if needed
  _isArrayChanged(isArray) {
    if (this.__internalChange) {
      return;
    }
    const v = this.value;
    if (!v || !isArray) {
      this._arrayValue = undefined;
      return;
    }
    this._arrayValue = this._itemsForArray(v);
  }

  /**
   * The `dom-repeat` requires an object to properly support changes.
   * In order to do this simple values has to be transformed into objects.
   *
   * @param {string[]} value An array of values.
   * @return {Array}
   */
  _itemsForArray(value) {
    let result = [];
    if (Array.isArray(value)) {
      result = value.map((item) => ({
          value: item
        }));
    } else {
      result.push({
        value
      });
    }
    return result;
  }

  // Handles array value change and sets the `value` property.
  _arrayValueChanged() {
    let arr = this._arrayValue;
    if (arr) {
      arr = arr.map((item) => item.value);
    }
    this.__internalChange = true;
    this.value = arr;
    this.__internalChange = false;
  }

  /**
   * Adds new element to the array value.
   * @return {number} Index of the value in the values array.
   * Note that the index may change over time if the user remove any value.
   */
  addEmptyArrayValue() {
    const items = this._arrayValue || [];
    items.push({
      value: ''
    });
    this._arrayValue = [...items];
    this._addEmptyArrayWarningMessage();
    return this._arrayValue.length - 1;
  }

  /**
   * Removes an array value for given index.
   * @param {Number} index A position of the value in the array
   */
  removeArrayValue(index) {
    const value = this._arrayValue;
    value.splice(index, 1);
    this._arrayValue = [...value];
    this._removeArrayWarningMessage(index);
    this._arrayValueChanged();
  }

  // Removes item from array value.
  _removeArrayValue(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    this.removeArrayValue(index);
  }

  /**
   * Fallback validator if form validator is unavailable.
   *
   * @return {boolean} True if the control is valid.
   */
  _defaultValidator() {
    const m = this.model;
    if (!m) {
      return true;
    }
    if (!m.required) {
      return true;
    }
    return !!m.value;
  }

  /**
   * Returns input(s) depending on model type.
   * @return {AnypointInput|AnypointInput[]|AnypointDropdownMenu|undefined} Returns an element for input, enum, and
   * boolean types. Returns NodeList for array type. Returns undefined when model is not set
   * or DOM is not ready.
   */
  _getInputElement() {
    if (this._isInput) {
      return /** @type AnypointInput */ (this.shadowRoot.querySelector('anypoint-input[data-type="input"]'));
    }
    if (this._isBoolean) {
      return /** @type AnypointDropdownMenu */ (this.shadowRoot.querySelector('anypoint-dropdown-menu[data-type="boolean"]'));
    }
    if (this._isEnum) {
      return /** @type AnypointDropdownMenu */ (this.shadowRoot.querySelector('anypoint-dropdown-menu[data-type="enum"]'));
    }
    if (this._isArray) {
      return Array.from(this.shadowRoot.querySelectorAll('anypoint-input[data-type="array"]'));
    }
    return undefined;
  }

  /**
   * Overrides `ValidatableMixin._getValidity`.
   * If the element is set to be `NIL` value it always returns true.
   * Otherwise it calls `_getInputsValidity()` for input validation result.
   * @return {Boolean} Validation result
   */
  _getValidity() {
    if (this._nilEnabled) {
      return true;
    }
    return this._getInputsValidity();
  }

  /**
   * Validates the inputs and returns validation state.
   * @return {Boolean}
   */
  _getInputsValidity() {
    const nodes = this._getInputElement();
    if (!nodes) {
      return this._defaultValidator();
    }
    if (Array.isArray(nodes)) {
      // const typed = /** @type NodeList */ (node);
      for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].validate()) {
          return false;
        }
      }
      return true;
    }
    return nodes.validate(nodes.value);
  }

  /**
   * Controls value and input state when "nil" checkbox value change.
   * @param {CustomEvent} e
   */
  async _nillableChanged(e) {
    const { value } = e.detail;
    this._nilEnabled = value;
    if (value) {
      this._oldNilValue = this.value;
      this.value = 'nil';
    } else if (this._oldNilValue) {
      this.value = this._oldNilValue;
      this._oldNilValue = undefined;
    } else if (this.value === 'nil') {
      this.value = '';
    }
    await this.updateComplete;
    this._getInputsValidity();
  }

  _listSelectionHandler(e) {
    if (this._isBoolean) {
      this.value = e.target.selected === 'true';
    } else {
      this.value = e.target.selected;
    }
    this._notifyInput();
  }

  /**
   * Handler for `input` event coming from regular input.
   * @param {Event} e
   */
  _inputHandler(e) {
    const input = /** @type AnypointInput */ (e.target);
    this.value = input.value;
    this._notifyInput();
  }

  /**
   * Handler for `change` event coming from regular input.
   * This is a special case for FF where input event won't be dispatched
   * for number type and when using arrow up/down.
   *
   * @param {Event} e
   */
  _inputChangeHandler(e) {
    const input = /** @type AnypointInput */ (e.target);
    if (input.type === 'number') {
      this.value = input.value;
      this._notifyInput();
    }
  }

  /**
   * Handler for input event coming from array items.
   * @param {Event} e
   */
  _arrayValueHandler(e) {
    const input = /** @type AnypointInput */ (e.target);
    const index = Number(input.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    const value = this._arrayValue;
    value[index].value = input.value;
    this._updateArrayValueWarningMessage(index);
    this._arrayValue = [...value];
    this._arrayValueChanged();
    this._notifyInput();
  }

  /**
   * Dispatches non-bubbling `input` event.
   */
  _notifyInput() {
    this.dispatchEvent(new CustomEvent('input'));
  }

  /**
   * Determines whether the schema is required. Returns true for
   * non-text inputs, returns false if the schema is a text type
   * and has no minCount or pattern restrictions
   * @param {Object} schema
   * @returns {Boolean}
   */
   _computeIsRequired(schema) {
    if (this._computeIsTextInput(schema)) {
      return (schema.minLength > 0 || Boolean(schema.pattern)) && schema.required;
    } 
      return schema.required;

  }

  /**
   * Determines whether warning message should be returned.
   * If value is present, show nothing.
   * Otherwise, return message if schema is text input, required, and
   * input is not required.
   * @param {Object} schema
   * @param {Boolean} required Input field computed required value
   * @returns {String|undefined}
   */
  _computeInputWarningMessage(value, required, schema) {
    if (!value && this._computeIsTextInput(schema) && !required && schema.required) {
      return `Value is required but currently empty.`
    }
    return undefined;
  }

  /**
   * Determines whether the schema for a form item
   * describes a text inpuot
   * @param {Object} schema 
   * @returns {Boolean} True is there is no input type, or if it 'text'
   */
  _computeIsTextInput(schema) {
    return !schema.inputType || schema.inputType === 'text';
  }

  /**
   * Set `_valueWarningMessage` based on `_value`'s content and
   * the model's schema.
   */
  _updateValueWarningMessage() {
    const { model, value } = this
    const viewModel = /** @type AmfFormItem */ model;
    if (!viewModel) {
      return;
    }
    const { schema = {} } = viewModel;
    const required = this._computeIsRequired(schema);
    this._valueWarningMessage = this._computeInputWarningMessage(value, required, schema);
  }

  /**
   * Set `_arrayWarningMessages` at @index based on the value of the array
   * at `index` value, using model's schema.
   * @param {Number} index Index of value in `_arrayValue` array
   */
  _updateArrayValueWarningMessage(index) {
    const { model, _arrayValue } = this;
    const { value } = _arrayValue[index];
    const viewModel = /** @type AmfFormItem */ model;
    if (!viewModel) {
      return;
    }
    const { schema = {} } = viewModel;
    const required = this._computeIsRequired(schema);
    this._arrayWarningMessages[index] = this._computeInputWarningMessage(value, required, schema);
  }

  /**
   * Adds new empty warning message to `_arrayWarningMessages` array
   * and immediately calls method to update the warning message at that
   * index.
   */
  _addEmptyArrayWarningMessage() {
    this._arrayWarningMessages = [...this._arrayWarningMessages, ''];
    this._updateArrayValueWarningMessage(this._arrayWarningMessages.length - 1);
  }

  /**
   * Removes warning messages at specified index.
   * @param {Number} index Index of `_arrayWarningMessages` array
   */
  _removeArrayWarningMessage(index) {
    const value = this._arrayWarningMessages;
    value.splice(index, 1);
    this._arrayWarningMessages = [...value];
  }

  _setWarningMessagesForArray(values) {
    if (!values) {
      return;
    }
    for (let i = 0; i < values.length; i++) {
      this._addEmptyArrayWarningMessage();
    }
  }
}
