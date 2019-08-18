/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-property-form-item.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {html, css, LitElement} from 'lit-element';

import {ValidatableMixin} from '@anypoint-web-components/validatable-mixin/validatable-mixin.js';

declare namespace ApiElements {

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
   * ### Example
   *
   * ```html
   * <api-property-form-item model='{"inputLabel": "Enter value"}'
   *  name="propertyName" value="{{value}}"></raml-type-form-input>
   * ```
   *
   * ### Styling
   *
   * `<raml-type-form-input>` provides the following custom properties and mixins for styling:
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--raml-type-form-input` | Mixin applied to the element | `{}`
   * `--api-property-form-item-input-label-color` | Input's label color | `rgba(0, 0, 0, 0.74)`
   * `--api-property-form-item-input-label-required-color` | Input's label color when required | `rgba(0, 0, 0, 0.74)`
   * `--from-row-action-icon-color` | Theme variable, color of the action icon button | `--icon-button-color` or `rgba(0, 0, 0, 0.74)`
   * `--from-row-action-icon-color-hover` | Theme variable, color of the action icon button when hovered | `--accent-color` or `rgba(0, 0, 0, 0.74)`
   * `--from-row-action-icon-opacity` | Opacity of the action icon button | `0.54`
   * `--from-row-action-icon-opacity` | Opacity of the action icon button when hovered | `0.74`
   * `--arc-font-caption` | Theme mixin, applied to array values label | `{}`
   * `--raml-type-form-input-array-border-color` | Border color of the element when it is array type item | `rgba(0, 0, 0, 0.14)`
   *
   * Also, use mixins and variables for `anypoint-input`, `paper-dropdown-menu`,
   * `anypoint-listbox`, and `anypoint-item` to style this element.
   */
  class ApiPropertyFormItem extends
    IronValidatableBehavior(
    Object) {

    /**
     * View model generated for this view.
     */
    model: Array<object|null>|null;

    /**
     * Input's value.
     */
    value: string|null|undefined;

    /**
     * Computed value, True if current item is an array object
     */
    _isArray: boolean|null|undefined;

    /**
     * Computed value, True if current item is an union with nill value.
     */
    _isNillable: boolean|null|undefined;

    /**
     * Name of the form item
     */
    name: string|null|undefined;

    /**
     * When set, prohibits inputs to have floating labels
     */
    noLabelFloat: boolean|null|undefined;

    /**
     * Enables outlined theme.
     */
    outlined: boolean|null|undefined;

    /**
     * Enables Anypoint legacy theme.
     */
    legacy: boolean|null|undefined;

    /**
     * Computed value, True if current item is a dropdown with values.
     */
    _isEnum: boolean|null|undefined;

    /**
     * Computed value, True if current item is an regular input
     */
    _isInput: boolean|null|undefined;

    /**
     * Computed value, True if current item is a boolean value
     */
    _isBoolean: boolean|null|undefined;

    /**
     * A value of an array item (only if `isArray` is set)
     */
    _arrayValue: any[]|null|undefined;

    /**
     * Set to indicate that the consol is required
     */
    required: boolean|null|undefined;

    /**
     * When set the editor is in read only mode.
     */
    readOnly: boolean|null|undefined;

    /**
     * When set the editor renders form controls disabled.
     */
    disabled: boolean|null|undefined;

    /**
     * Computed value, renders nillable switch when needed.
     */
    _renderNillable: boolean|null|undefined;
    _enumTemplate(): any;
    _booleanTemplate(): any;
    _inputTemplate(): any;
    _arrayTemplate(): any;
    render(): any;

    /**
     * Resets UI state variables
     */
    _resetStates(): void;

    /**
     * Sets the template depending on model configuration
     */
    _modelChanged(model: any): void;

    /**
     * Sets `arrayValue` from model's value.
     *
     * @param model ARC amf view model.
     */
    _prepareArraySchema(model: object|null): void;

    /**
     * Sets array values if needed
     */
    _isArrayChanged(isArray: any): void;

    /**
     * The `dom-repeat` requires an object to properly support changes.
     * In order to do this simple values has to be transformed into objects.
     *
     * @param value An array of values.
     */
    _itemsForArray(value: Array<String|null>|null): any[]|null;

    /**
     * Handles array value change and sets the `value` property.
     */
    _arrayValueChanged(): void;

    /**
     * Adds new element to the array value.
     *
     * @returns Index of the value in the values array.
     * Note that the index may change over time if the user remove any value.
     */
    addEmptyArrayValue(): Number|null;

    /**
     * Removes an array value for given index.
     *
     * @param index A position of the value in the array
     */
    removeArrayValue(index: Number|null): void;

    /**
     * Removes item from array value.
     */
    _removeArrayValue(e: any): void;

    /**
     * Fallback validator if form validator is unavailable.
     *
     * @returns True if the constrol is valid.
     */
    _defaultValidator(): Boolean|null;
    _getValidity(): any;

    /**
     * Computes value for `_renderNillable` property.
     */
    _computeRenderNillable(isNillable: Boolean|null, isArray: Boolean|null): Boolean|null;

    /**
     * Controls value and input state when "nil" checkbox's value change.
     */
    _nillableChanged(e: CustomEvent|null): void;

    /**
     * Finds input element in the DOM
     *
     * @returns An element that represents the main UI input
     * element or undefined for array types.
     */
    _getInput(): Element|null|undefined;

    /**
     * Computes value for anypoint-input's always-float-label attribute.
     * It forces label float for some types of inputs.
     */
    _computeAlwaysFloatLabel(inputFloatLabel: Boolean|null, inputType: String|null): Boolean|null;
    _listSelectionHandler(e: any): void;
    _inputHandler(e: any): void;
    _arrayValueHandler(e: any): void;
  }
}

declare global {

  interface HTMLElementTagNameMap {
    "api-property-form-item": ApiElements.ApiPropertyFormItem;
  }
}
