import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-button.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-group.js';
import '../api-property-form-item.js';

class ComponentDemo extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'readOnly', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11',
      'outlineStyle'
    ]);
    this._componentName = 'api-property-form-item';
    this._readonlyHandler = this._readonlyHandler.bind(this);
    this._valueHandler = this._valueHandler.bind(this);
    this._inputStyleChange = this._inputStyleChange.bind(this);

    this.readOnly = false;
    this.v1 = 'Value';
    this.m1 = { schema: { inputLabel: 'Enter value' } };
    this.m2 = { schema: { inputLabel: 'Enter value', pattern: '[a-zA-Z0-9_]*' } };
    this.m3 = { schema: { inputLabel: 'Enter value' }, required: true };
    this.m4 = { schema: {
      inputLabel: 'Enter value',
      inputPlaceholder: 'This is the placeholder',
      inputFloatLabel: true
    } };
    this.m5 = { schema: {
      inputLabel: 'Enter number value',
      inputType: 'number',
      minimum: 1,
      maximum: 100
    } };
    this.m6 = { schema: { inputLabel: 'Select date', inputType: 'date' } };
    this.m7 = {
      required: true,
      schema: {
        inputLabel: 'Select fruit',
        isEnum: true,
        enum: ['apple', 'banana', 'cherries', 'grapes', 'lemon', 'orange', 'pear', 'watermelon']
      }
    };
    this.m8 = { required: true, schema: { inputLabel: 'Select boolean value', isBool: true } };
    this.m9 = {
      required: true,
      schema: {
        inputLabel: 'Enter values',
        isArray: true,
        inputType: 'text',
        minLength: 2,
        maxLength: 20,
        isNillable: true
      }
    };
    this.m10 = {
      required: true,
      schema: {
        type: 'union',
        inputLabel: 'Value or nil',
        isNillable: true,
        inputType: 'text'
      }
    };

    this.m11 = {
      required: true,
      schema: {
        type: 'union',
        inputLabel: 'Enum or nil',
        isNillable: true,
        isEnum: true,
        inputType: 'text',
        enum: ['apple', 'banana', 'cherries', 'grapes', 'lemon', 'orange', 'pear', 'watermelon']
      }
    };
  }

  get compatibilityStyle() {
    return this._compatibilityStyle;
  }

  set compatibilityStyle(value) {
    this._setObservableProperty('compatibilityStyle', value);
    if (value) {
      document.body.classList.add('compatibility');
    } else {
      document.body.classList.remove('compatibility');
    }
  }

  _readonlyHandler(e) {
    this.readOnly = e.target.checked;
  }

  _valueHandler(e) {
    const prop = e.target.dataset.target;
    this[prop] = e.detail.value;
  }

  _inputStyleChange(e) {
    const { value } = e.detail;
    if (value === 0) {
      this.outlineStyle = false;
      this.compatibilityStyle = false;
    } else if (value === 1) {
      this.outlineStyle = true;
      this.compatibilityStyle = false;
    } else if (value === 2) {
      this.outlineStyle = false;
      this.compatibilityStyle = true;
    }
  }

  contentTemplate() {
    const {
      readOnly,
      outlineStyle,
      compatibilityStyle
    } = this;
    return html`
      <div class="demo-container">
        <section class="card">
          <h3>Configuration</h3>
          <paper-toggle-button @checked-changed="${this._readonlyHandler}">Read only</paper-toggle-button>

          <label id="styleLabel">Style</label>
          <anypoint-radio-group aria-labelledby="styleLabel" @selected-changed="${this._inputStyleChange}">
            <anypoint-radio-button name="inputStyle" checked>Filled</anypoint-radio-button>
            <anypoint-radio-button name="inputStyle">Outlined</anypoint-radio-button>
            <anypoint-radio-button name="inputStyle">Compatibility</anypoint-radio-button>
          </anypoint-radio-group>
        </section>
      </div>

      <section class="card">
        <h3>Text editor</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m1}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="simpleModel"
          data-target="v1"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v1}</code>
      </section>

      <section class="card">
        <h3>Text editor with pattern</h3>
        <p>Pattern: <code>[a-zA-Z0-9_]*</code></p>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m2}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="patternModel"
          data-target="v2"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v2}</code>
      </section>

      <section class="card">
        <h3>Required input</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m3}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          required
          name="requiredModel"
          data-target="v3"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v3}</code>
      </section>

      <section class="card">
        <h3>With placeholder</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m4}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="placeholderModel"
          data-target="v4"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v4}</code>
      </section>

      <section class="card">
        <h3>Number editor</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m5}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="numericModel"
          data-target="v5"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v5}</code>
      </section>

      <section class="card">
        <h3>Date editor</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m6}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="dateModel"
          data-target="v6"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v6}</code>
      </section>

      <section class="card">
        <h3>Enum values</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m7}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="enumModel"
          data-target="v7"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v7}</code>
      </section>

      <section class="card">
        <h3>Boolean value</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m8}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="enumModel"
          data-target="v8"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v8}</code>
      </section>

      <section class="card">
        <h3>Array value</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m9}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="arrayModel"
          data-target="v9"
          @value-changed="${this._valueHandler}"
          isarray></api-property-form-item>
        <code>${this.v9 && this.v9.length ? JSON.stringify(this.v9, null, 2) : undefined}</code>
      </section>

      <section class="card">
        <h3>Enum with nil value</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m11}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="unionNilModel"
          data-target="v11"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v11}</code>
      </section>

      <section class="card">
        <h3>Union with nil value</h3>
        <api-property-form-item
          .readOnly="${readOnly}"
          .model="${this.m10}"
          ?outlined="${outlineStyle}"
          ?compatibility="${compatibilityStyle}"
          name="unionNilModel"
          data-target="v10"
          @value-changed="${this._valueHandler}"></api-property-form-item>
        <code>${this.v10}</code>
      </section>
  `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
