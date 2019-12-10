import { css } from 'lit-element';

export default css`
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
