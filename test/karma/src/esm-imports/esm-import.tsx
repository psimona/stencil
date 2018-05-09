import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '../../../../dist/index';


@Component({
  tag: 'esm-import'
})
export class EsmImport {

  @Element() el: any;
  @Prop() propVal = 0;
  @State() stateVal: string;
  @State() someEventInc = 0;
  @Event() someEvent: EventEmitter;

  @Listen('input')
  testClick(ev: any) {
    this.stateVal = ev.target.value;
  }

  @Method()
  someMethod() {
    this.someEvent.emit();
  }

  testMethod() {
    this.el.someMethod();
  }

  componentWillLoad() {
    this.stateVal = 'mph';
  }

  componentDidLoad() {
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
        <p><input/></p>
        <p><button onClick={this.testMethod.bind(this)}>Test</button></p>
      </div>
    );
  }
}
