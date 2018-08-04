import { observable } from 'mobx';


class Store {
  @observable onDragEnd = () => {};
}

export const uiStore = new Store();
