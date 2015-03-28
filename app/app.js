require ('app/filters');
require ('app/services');
require ('app/directives');

// controllers sub-module
angular.module('myApp.controllers', []);
require ('app/controllers/my-ctrl-1');
require ('app/controllers/my-ctrl-2');

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'slick',  // slick carousel (homepage)
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]);


