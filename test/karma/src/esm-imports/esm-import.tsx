import { Component, Event, EventEmitter, Listen, Method, Prop, State } from '../../../../dist/index';


@Component({
  tag: 'esm-import'
})
export class MyEsmComponent {

  @Prop() propVal: number;
  @State() stateVal: number;
  @Event() someEvent: EventEmitter;

  @Listen('click')
  testClick() {
    this.stateVal++;
    this.someEvent.emit(this.stateVal);
  }

  @Method()
  someMethod() {
    this.stateVal++;
  }

  componentWillLoad() {
    this.stateVal = 0;
  }

  render() {
    return (
      <div>
        <p>esm-import</p>
        <p>propVal: {this.propVal}</p>
        <p>stateVal: {this.stateVal}</p>
        <button>Listen Test</button>
      </div>
    );
  }
}
