// Redux (The centralized application state)
import store from '../redux/store';

// Lit (The template management)
import { html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { PageViewElement } from 'pwa-starter-kit/src/components/page-view-element';

import { operations } from '../redux/sign-in';

class LoginForm extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _user: { type: Object }
    };
  }
  render() {
    return html`
    <link href="vendors~index.css" rel="stylesheet">
    <div class="uk-margin">
      <label class="uk-form-label" for="email">email<input class="uk-input" type="text" id="email" autocorrect="off" autocapitalize="none" .value="${this._user.email}" @input="${e => this.handleEmail(e)}"></label>
    </div>
    <div class="uk-margin">
      <label class="uk-form-label" for="password">password<input class="uk-input" type="password" id="password" autocorrect="off" autocapitalize="none" .value="${this._user.password}" @input="${e => this.handlePassword(e)}"></label>
    </div>
    <div class="uk-margin">
      <button class="uk-button uk-button-primary uk-width-1-1" type="button" id="signBtn" @click="${() =>
  {
    store.dispatch(operations.doSignIn({
      email: this._user.email,
      password: this._user.password,
    }));
  }}">sigin</button>
    </div>
    <div class="uk-margin">
      <div class="msg" id="signMsg">&nbsp;</div>
    </div>
    `
    ;
  }
  stateChanged(state) {
    this._user = state.user;
  }
  handleEmail(e) {
    this._user.email = e.target.value;
  }
  handlePassword(e) {
    this._user.password = e.target.value;
  }
}
try {
  window.customElements.define('login-form', LoginForm);
} catch (error) {
//
}
