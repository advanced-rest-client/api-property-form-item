import { html, css, LitElement } from 'lit-element';
import { ValidatableMixin } from '@anypoint-web-components/validatable-mixin/validatable-mixin.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import { addCircleOutline, removeCircleOutline } from  '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
/**
 * An element that renders a form input to edit API type value.
 *
 * This element is to replace deprecated `raml-type-form-input` that has
 * the same functionality but works with RAML data only.
 *
 * **If you need an element that works with Polymer 1.0, use old `raml-type-form-input` element**
 *
 * It accespt ARC view model generated by either `api-headers-editr`
 * or `api-url-data-model`. The model is generated using
 * `api-view-model-transformer` that transforms AMF `json/ld` API model
 * into data model consumable by ARC UI elements.
 *
 * Also, use mixins and variables for `anypoint-input`, `paper-dropdown-menu`,
 * `anypoint-listbox`, and `anypoint-item` to style this element.
 *
 * @customElement
 * @memberof ApiElements
 * @appliesMixin ValidatableMixin
 * @demo demo/index.html
 * @extends LitElement
 */
class ApiPropertyFormItem extends ValidatableMixin(LitElement) {
  get styles() {
    return css`
    :host {
      display: inline-block;
      position: relative;
      /* <input> width */
      min-width: 200px;
    }

    :host([isarray]) .content {
      padding-left: 8px;
      border-left: 1px var(--raml-type-form-input-array-border-color, rgba(0, 0, 0, 0.14)) solid;
    }

    :host(:not([isarray])) .content {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .array-item {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    anypoint-input,
    anypoint-dropdown-menu {
      flex: 1;
      width: auto;
    }

    anypoint-button .icon {
      margin-right: 12px;
    }

    .nil-option {
      margin-left: 8px;
    }

    .array-label {
      margin-left: 8px;
    }

    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      fill: currentColor;
    }`;
  }

  _enumTemplate() {
    const { model, name, readOnly, disabled, value, outlined, compatibility, _nilEnabled } = this;
    const values = model.schema.enum || [];
    return html`
    <anypoint-dropdown-menu
      name="${name}"
      ?required="${!_nilEnabled && model.required}"
      autovalidate
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
    const { model, name, readOnly, disabled, value, outlined, compatibility, _nilEnabled } = this;
    const bindValue = (value === true || value === 'true') ? 'true' : 'false';
    return html`
    <anypoint-dropdown-menu
      name="${name}"
      ?required="${!_nilEnabled && model.required}"
      autovalidate
      data-type="boolean"
      ?disabled="${readOnly || disabled || _nilEnabled}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
    >
      <label slot="label">${model.schema.inputLabel}</label>
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
    const { model, name, noLabelFloat, readOnly, disabled, value, outlined, compatibility, _nilEnabled } = this;
    if (!model) {
      return;
    }
    if (!model.schema) {
      model.schema = {};
    }
    return html`<anypoint-input
      .value="${value}"
      ?required="${!_nilEnabled && model.required}"
      .pattern="${model.schema.pattern}"
      .name="${name}"
      autovalidate
      .type="${model.schema.inputType}"
      .min="${model.schema.minimum}"
      .max="${model.schema.maximum}"
      .maxLength="${model.schema.maxLength}"
      .minLength="${model.schema.minLength}"
      .placeholder="${model.schema.inputPlaceholder}"
      ?nolabelfloat="${noLabelFloat}"
      ?readonly="${readOnly}"
      ?disabled="${disabled || _nilEnabled}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      data-type="input"
      @input="${this._inputHandler}"
      @change="${this._inputChangeHandler}"
      invalidmessage="${`${name} is invalid. Check documentation.`}"
    >
      <label slot="label">${model.schema.inputLabel}</label>
    </anypoint-input>`;
  }

  _arrayTemplate() {
    const { model, name, readOnly, disabled, _arrayValue, outlined, compatibility, _nilEnabled } = this;
    const values = _arrayValue || [];
    const itemLabel = model.schema.inputLabel || 'Parameter value';
    return html`
    <label class="array-label">${itemLabel}</label>

    ${values.map((item, index) => html`
    <div class="array-item">
      <anypoint-input
        .value="${item.value}"
        ?required="${!_nilEnabled && model.required}"
        .pattern="${model.schema.pattern}"
        .name="${name}"
        autovalidate
        .type="${model.schema.inputType}"
        .min="${model.schema.minimum}"
        .max="${model.schema.maximum}"
        .maxLength="${model.schema.maxLength}"
        .minLength="${model.schema.minLength}"
        nolabelfloat
        ?readonly="${readOnly}"
        ?disabled="${disabled || _nilEnabled}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        data-type="array"
        data-index="${index}"
        @input="${this._arrayValueHandler}"
        invalidmessage="${`${name} is invalid. Check documentation.`}"
      >
        <label slot="label">${itemLabel}<label>
      </anypoint-input>
      ${index ? html`<anypoint-icon-button
        class="action-icon"
        data-index="${index}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        @click="${this._removeArrayValue}"
        title="Remove array value"
        ?disabled="${this.readOnly || disabled}"
      >
        <span class="icon">${removeCircleOutline}</span>
      </anypoint-icon-button>` : undefined}
    </div>`)}
    <div class="add-action">
      <anypoint-button
        @click="${this.addEmptyArrayValue}"
        title="Add array velue button"
        ?disabled="${readOnly || disabled}"
        ?outlined="${outlined}"
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
       *
       * @type {Array<Object>}
       */
      model: { type: Array },
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
       * @deprecated Use `compatibility` instead
       */
      legacy: { type: Boolean },
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
      disabled: { type: Boolean }
    };
  }

  get legacy() {
    return this.compatibility;
  }

  set legacy(value) {
    this.compatibility = value;
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
    this._isArrayChanged(this._isArray, value);
    const opts = {
      detail: {
        value
      }
    };
    this.dispatchEvent(new CustomEvent('changed', opts));
    this.dispatchEvent(new CustomEvent('value-changed', opts));
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
    this._isArrayChanged(value, this.value);
    if (value) {
      this.setAttribute('isarray', '');
    } else {
      this.removeAttribute('isarray');
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
      this.setAttribute('isnillable', '');
    } else {
      this.removeAttribute('isnillable');
    }
  }

  constructor() {
    super();
    this._isInput = true;
    this.value = '';
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

  // Sets the template depending on model configuration
  _modelChanged(model) {
    this._resetStates();
    if (!model) {
      return;
    }
    const schema = model.schema;
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
   * @param {Object} model ARC amf view model.
   */
  _prepareArraySchema(model) {
    this._isArray = true;
    let value;
    if (model.value && model.value instanceof Array) {
      value = model.value.map((item) => {
        return {
          value: item
        };
      });
    } else {
      value = [];
    }
    this._arrayValue = value;
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
   * @param {Array<String>} value An array of values.
   * @return {Array}
   */
  _itemsForArray(value) {
    let result = [];
    if (value instanceof Array) {
      result = value.map(function(item) {
        return {
          value: item
        };
      });
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
   * @return {Number} Index of the value in the values array.
   * Note that the index may change over time if the user remove any value.
   */
  addEmptyArrayValue() {
    const items = this._arrayValue || [];
    items.push({
      value: ''
    });
    this._arrayValue = [...items];
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
    this._arrayValueChanged();
  }

  // Removes item from array value.
  _removeArrayValue(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (index !== index) {
      return;
    }
    this.removeArrayValue(index);
  }
  /**
   * Fallback validator if form validator is unavailable.
   *
   * @return {Boolean} True if the constrol is valid.
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
   * @return {Element|NodeList|undefined} Returns an element for input, enum, and
   * boolean types. Returns NodeList for array type. Returns undefined when model is not set
   * or DOM is not ready.
   */
  _getInputElement() {
    if (this._isInput) {
      return this.shadowRoot.querySelector('anypoint-input[data-type="input"]');
    }
    if (this._isBoolean) {
      return this.shadowRoot.querySelector('anypoint-dropdown-menu[data-type="boolean"]');
    }
    if (this._isEnum) {
      return this.shadowRoot.querySelector('anypoint-dropdown-menu[data-type="enum"]');
    }
    if (this._isArray) {
      return this.shadowRoot.querySelectorAll('anypoint-input[data-type="array"]');
    }
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
    const node = this._getInputElement();
    if (!node) {
      return this._defaultValidator();
    }
    if (this._isArray) {
      for (let i = 0; i < node.length; i++) {
        if (!node[i].validate()) {
          return false;
        }
      }
      return true;
    }
    return node.validate();
  }
  /**
   * Controls value and input state when "nil" checkbox's value change.
   * @param {CustomEvent} e
   */
  async _nillableChanged(e) {
    const { value } = e.detail;
    this._nilEnabled = value;
    if (value) {
      this._oldNilValue = this.value;
      this.value = 'nil';
    } else {
      if (this._oldNilValue) {
        this.value = this._oldNilValue;
        this._oldNilValue = undefined;
      } else if (this.value === 'nil') {
        this.value = '';
      }
    }
    await this.updateComplete;
    this._getInputsValidity();
  }

  _listSelectionHandler(e) {
    if (this._isBoolean) {
      this.value = e.target.selected === 'true' ? true : false;
    } else {
      this.value = e.target.selected;
    }
    this._notifyInput();
  }

  _inputHandler(e) {
    this.value = e.target.value;
    this._notifyInput();
  }

  _inputChangeHandler(e) {
    // in FF input event won't fire for number type and when using arrow up/down.
    if (e.target.type === 'number') {
      this.value = e.target.value;
      this._notifyInput();
    }
  }

  _arrayValueHandler(e) {
    const index = Number(e.target.dataset.index);
    if (index !== index) {
      return;
    }
    const value = this._arrayValue;
    value[index].value = e.target.value;
    this._arrayValue = [...value];
    this._arrayValueChanged();
    this._notifyInput();
  }

  _notifyInput() {
    this.dispatchEvent(new CustomEvent('input'));
  }
}

window.customElements.define('api-property-form-item', ApiPropertyFormItem);
