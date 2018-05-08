import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '../../../../dist/index';


@Component({
  tag: 'esm-import'
})
export class EsmImport {

  @Element() el: any;
  @Prop() propVal = 0;
  @State() stateVal: number;
  @State() someEventInc = 0;
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

  testMethod() {
    this.el.someMethod();
  }

  componentWillLoad() {
    this.stateVal = 0;

    this.el.parentElement.addEventListener('someEvent', () => {
      this.el.propVal++;
    });
  }

  render() {
    return (
      <div>
        <p>esm-import</p>
        <p>propVal: {this.propVal}</p>
        <p>stateVal: {this.stateVal}</p>
        <p>someEvent: {this.stateVal}</p>
        <p><button>Listen Test</button></p>
        <p><button onClick={this.testMethod.bind(this)}>Method Test</button></p>
      </div>
    );
  }
}
