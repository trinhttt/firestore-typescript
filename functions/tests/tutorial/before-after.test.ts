//1: Repeating Setup For Many Tests
// **Repeating each test
// settup work that needs to happen before and after tests run
// use beforeEach and afterEach: have some work you need to do repeatedly for many tests

function initializeCityDatabase() {}
async function asyncInitializeCityDatabase() {}
function clearCityDatabase() {}
async function initializeFoodDatabase() {}
beforeEach(() => {
    initializeCityDatabase();
});

afterEach(() => {
    clearCityDatabase();
});

// can handle asynchronous: if initializeCityDatabase() returned a promise that resolved when the database was initialized, we would want to return that promise:
// add return 
beforeEach(() => {
    return asyncInitializeCityDatabase();
});

//One-Time Setup
//only need to do setup once, at the beginning of a file
// if both initializeCityDatabase and clearCityDatabase returned promises, and the city database could be reused between tests, we could change our test code to
beforeAll(() => {
    return initializeCityDatabase();
  });
  
  afterAll(() => {
    return clearCityDatabase();
  });
  

//Scoping#
//By default, the before and after blocks apply to every test in a file. 
// You can also group tests together using a describe block. 
// When they are inside a describe block, the before and after blocks only apply to the tests within that describe block.
describe('matching cities to foods', () => {
    // Applies only to tests in this describe block
    beforeEach(() => {
      return initializeFoodDatabase();
    });
  
    test('Vienna <3 veal', () => {
    });
  });

//Note that the top-level beforeEach is executed before the beforeEach inside the describe block
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll