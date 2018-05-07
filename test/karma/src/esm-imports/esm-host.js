
var MyEsmComponent = /** @class */ (function () {
  function MyEsmComponent() {
  }
  MyEsmComponent.is = 'esm-import';
  MyEsmComponent.getModule = function () {
    return import('./esm-cmp.js').then(function(m) {
      return m.MyEsmComponent;
    });
  };
  return MyEsmComponent;
}());

export { MyEsmComponent };
