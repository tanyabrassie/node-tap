---
title: Promises
section: 4.02
---

# Promises

The `t.test()`, `t.spawn()` and `t.stdin()` methods all return a
Promise which resolves to the `t` object once the child test, process,
or input stream is done.  (Note that the returned Promise does *not*
resolve to the *child* object, because the child is already ended when
control returns to the parent.)

Additionally, if the function passed to `t.test()` *returns* a
Promise, then the child test will be ended when the Promise resolves,
or failed when it is rejected.

These two features together mean that you can string together Promise
chains in your tests, if that's a thing you're into.

Unhandled promise rejections will be fail the active test, just like thrown
errors would.

Here is an example:

```javascript
const t = require('tap')
t.test('get thing', t =>
  getSomeThing().then(result =>
    t.test('check result', t => {
      t.equal(result.foo, 'bar')
      t.end()
    })))
.then(t =>
  getTwoThings().then(things =>
    t.test('the things', t => {
      t.equal(things.length, 2)
      return makeSomeOtherPromise()
    }))
  .then(otherPromiseResult =>
    t.test('check other promise thing', t => {
      t.equal(otherPromiseResult, 7, 'it should be seven')
      t.end()
    })))
```

If this sort of style offends you, you are welcome to ignore it.  It's
not mandatory.

If you want to pass Promises to [assertions](/docs/api/asserts) and have them
auto-resolve, then check out [tapromise](http://npm.im/tapromise).

## Rejected promise

To verify that a promise is rejected, you can use the
[`t.rejects()`](/asserts/#trejectspromise--fn-expectederror-message-extra)
function.

## `async`/`await`

Because `async` functions return a Promise, you can use them out of
the box with node-tap.  If you pass an `async` function as the
`t.test()` callback, then tap will detect the promise return and move
onto the next test once the async function has completely resolved.

The above example could be written like this:

```js
const t = require('tap')
t.test('get thing', async t => {
  const result = await getSomeThing()
  await t.test('check result', async t => t.equal(result.foo, 'bar'))
}).then(async function (t) {
  const things = await getTwoThings()

  const otherPromiseResult = await t.test('the things', async t => {
    t.equal(things.length, 2)
  }).then(() => makeSomeOtherPromise())

  await t.test('check other promise thing', t => {
    t.equal(otherPromiseResult, 7, 'it should be seven')
    t.end()
  })
})
```

Because subtests return promises, you can also `await` them to do
things in between subtests.  However, this requires a top-level async
function.

For example:

```js
const t = require('tap')

async main = () => {
  await t.test('get thing', t =>
    getSomeThing().then(result =>
      t.test('check result', async t =>
        t.equal(result.foo, 'bar'))))

  const things = await getTwoThings()
  const otherPromiseResult = await t.test('got two things', async t =>
    t.equal(things.length, 2)).then(() => makeSomeOtherPromise())

  await t.test('check other promise thing', async t =>
    t.equal(otherPromiseResult, 7, 'it should be seven'))

  console.log('tests are all done!')
}
main()
```
