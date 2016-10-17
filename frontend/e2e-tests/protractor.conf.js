exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  capabilities: 
    {
        'browserName': 'chrome'
    }, 
   

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',
    isVerbose: true,
    showColors: true,
    jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
  ,
  onPrepare: function () {
      //TODO
//    require('jasmine-reporters');
//    jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter('reports/', true, true));
//    jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());

//    jasmine.getEnv().addReporter(new HtmlReporter({
//        baseDirectory: 'reports/screenshots'   ,
//        takeScreenShotsOnlyForFailedSpecs: true
//    }));
    },
};
