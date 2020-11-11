import { CSSResult, LitElement, TemplateResult } from 'lit-element';
import { ValidatableMixin } from '@anypoint-web-components/validatable-mixin';
import { ModelItem } from '@api-components/api-view-model-transformer';
import { AnypointInput } from '@anypoint-web-components/anypoint-input';
import { AnypointDropdownMenu } from '@anypoint-web-components/anypoint-dropdown-menu';

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
 * 
 * @fires changed When the value of the control change.
 */
export class ApiPropertyFormItem extends ValidatableMixin(LitElement) {
  get styles(): CSSResult;

  _enumTemplate(): TemplateResult;

  _booleanTemplate(): TemplateResult | string;

  _inputTemplate(): TemplateResult | string;

  _arrayTemplate(): TemplateResult | string;

  render(): TemplateResult;

  /**
   * View model generated for this view.
   */
  model: ModelItem;
  /**
   * Name of the form item
   * @attribute
   */
  name: string;
  /**
   * When set, prohibits inputs to have floating labels
   * @attribute
   */
  noLabelFloat: boolean;
  /**
   * Enables outlined theme.
   * @attribute
   */
  outlined: boolean;
  /**
   * Enables compatibility with Anypoint components.
   * @attribute
   */
  compatibility: boolean;
  /**
   * Input's value.
   * @attribute
   */
  value: string;
  // Computed value, True if current item is a dropdown with values.
  _isEnum: boolean;
  // Computed value, True if current item is an regular input
  _isInput: boolean;
  // Computed value, True if current item is an array object
  _isArray: boolean;
  // Computed value, True if current item is an union with nill value.
  _isNillable: boolean;

  _nilEnabled: boolean;
  // Computed value, True if current item is a boolean value
  _isBoolean: boolean;
  // A value of an array item (only if `isArray` is set)
  _arrayValue: (string|number)[];
  /**
   * Set to indicate that the consol is required
   * @attribute
   */
  required: boolean;
  /**
   * When set the editor is in read only mode.
   * @attribute
   */
  readOnly: boolean;
  /**
   * When set the editor renders form controls disabled.
   * @attribute
   */
  disabled: boolean;


  constructor();

  /**
   * Resets UI state variables
   */
  _resetStates(): void;

  // Sets the template depending on model configuration
  _modelChanged(model: ModelItem): void;

  /**
   * Sets `arrayValue` from model's value.
   *
   * @param model ARC amf view model.
   */
  _prepareArraySchema(model: ModelItem): void;

  // Sets array values if needed
  _isArrayChanged(isArray: boolean): void;

  /**
   * The `dom-repeat` requires an object to properly support changes.
   * In order to do this simple values has to be transformed into objects.
   *
   * @param value An array of values.
   */
  _itemsForArray(value: string|string[]): string[];

  // Handles array value change and sets the `value` property.
  _arrayValueChanged(): void;

  /**
   * Adds new element to the array value.
   * @return Index of the value in the values array.
   * Note that the index may change over time if the user remove any value.
   */
  addEmptyArrayValue(): number;

  /**
   * Removes an array value for given index.
   * @param index A position of the value in the array
   */
  removeArrayValue(index: number): void;

  // Removes item from array value.
  _removeArrayValue(e: Event): void;

  /**
   * Fallback validator if form validator is unavailable.
   *
   * @return True if the control is valid.
   */
  _defaultValidator(): boolean;

  /**
   * Returns input(s) depending on model type.
   * @return Returns an element for input, enum, and
   * boolean types. Returns NodeList for array type. Returns undefined when model is not set
   * or DOM is not ready.
   */
  _getInputElement(): AnypointInput|AnypointInput[]|AnypointDropdownMenu|undefined;

  /**
   * Overrides `ValidatableMixin._getValidity`.
   * If the element is set to be `NIL` value it always returns true.
   * Otherwise it calls `_getInputsValidity()` for input validation result.
   * @returns Validation result
   */
  _getValidity(): boolean;

  /**
   * Validates the inputs and returns validation state.
   */
  _getInputsValidity(): boolean;
  /**
   * Controls value and input state when "nil" checkbox value change.
   */
  _nillableChanged(e: CustomEvent): Promise<void>;

  _listSelectionHandler(e: Event): void;

  /**
   * Handler for `input` event coming from regular input.
   */
  _inputHandler(e: Event): void;

  /**
   * Handler for `change` event coming from regular input.
   * This is a special case for FF where input event won't be dispatched
   * for number type and when using arrow up/down.
   */
  _inputChangeHandler(e: Event): void;

  /**
   * Handler for input event coming from array items.
   */
  _arrayValueHandler(e: Event): void;

  /**
   * Dispatches non-bubbling `input` event.
   */
  _notifyInput(): void;
}
