import { action, observable } from 'mobx';


class Store {
  @observable showHeader = true;

  @action
  setShowHeader(show) {
    this.showHeader = show;
  }
}

export const uiStore = new Store();
