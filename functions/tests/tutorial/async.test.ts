
async function fetchData() {}

// Async/Await
// use async and await
test('the data is trinh', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
})

test('fetch fails with an error', async () => {
  //This is often useful when testing asynchronous code, in order to make sure that assertions in a callback actually got called.
  expect.assertions(1)
  try {
    await fetchData()
  } catch (e) {
    expect(e).toMatch('error')
  }
})

// can combine async and await with .resolves or .rejects
test('the data is trinh', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter')
})

test('fetch fails with an error', async () => {
  await expect(fetchData()).rejects.toMatch('error')
})

//-------------------
//callback
// use done(...): Jest will wait until the done callback is called before finishing the test.
//If done() is never called, the test will fail (with timeout error), which is what you want to happen.
test('the data is peanut butter', done => {
  // function callback(data) {
  //   try {
  //     expect(data).toBe('peanut butter');
  //     done();
  //   } catch (error) {
  //     done(error);
  //   }
  // }

  // fetchData(callback(1));
});

//Promises
// Be sure to "return" the promise
// if you omit this return statement, your test will complete before the promise returned from fetchData resolves and then() has a chance to execute the callback.
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});

// Make sure to add expect.assertions to verify that a certain number of assertions are called
test('the fetch fails with an error', () => {
  expect.assertions(1);
  return fetchData().catch(e => expect(e).toMatch('error'));
});

// use .resolves / .rejects
// If the promise is rejected, the test will automatically fail.
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});

//If the promise is fulfilled, the test will automatically fail.
test('the fetch fails with an error', () => {
  return expect(fetchData()).rejects.toMatch('error');
});