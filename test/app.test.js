const { test, before, after } = require("node:test");
const assert = require("node:assert");
const app = require("../src/app");

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});

test("GET /health trả 503 khi chưa kết nối MongoDB", async () => {
  const res = await fetch(`${base}/health`);
  assert.strictEqual(res.status, 503);
  const body = await res.json();
  assert.strictEqual(body.status, "unavailable");
});

test("đường dẫn không tồn tại trả 404", async () => {
  const res = await fetch(`${base}/khong-co`);
  assert.strictEqual(res.status, 404);
});
