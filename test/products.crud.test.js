const { test, before, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const app = require("../src/app");
const Product = require("../src/models/Product");

const MONGO_URI = process.env.MONGO_URI;
const skip = MONGO_URI ? false : "bỏ qua vì chưa đặt MONGO_URI";
const PID = 9001;

let server;
let base;

async function call(method, path, body) {
  const res = await fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
}

before(async () => {
  if (!MONGO_URI) return;
  await mongoose.connect(MONGO_URI);
  await Product.init();
  await Product.deleteMany({ pid: PID });
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (!MONGO_URI) return;
  await Product.deleteMany({ pid: PID });
  await mongoose.disconnect();
  server.close();
});

test("GET /health trả 200 khi đã kết nối MongoDB", { skip }, async () => {
  const { status, data } = await call("GET", "/health");
  assert.strictEqual(status, 200);
  assert.strictEqual(data.database, "connected");
});

test("POST tạo sản phẩm trả 201", { skip }, async () => {
  const { status, data } = await call("POST", "/api/products", {
    pid: PID,
    pname: "Test CRUD",
    price: 10,
    quantity: 5,
  });
  assert.strictEqual(status, 201);
  assert.strictEqual(data.pid, PID);
});

test("POST trùng pid trả 409", { skip }, async () => {
  const { status } = await call("POST", "/api/products", {
    pid: PID,
    pname: "Trung",
    price: 1,
    quantity: 1,
  });
  assert.strictEqual(status, 409);
});

test("POST thiếu pname trả 400", { skip }, async () => {
  const { status } = await call("POST", "/api/products", {
    pid: PID + 1,
    price: 1,
    quantity: 1,
  });
  assert.strictEqual(status, 400);
});

test("GET danh sách có sản phẩm vừa tạo", { skip }, async () => {
  const { status, data } = await call("GET", "/api/products");
  assert.strictEqual(status, 200);
  assert.ok(data.some((p) => p.pid === PID));
});

test("GET một sản phẩm theo pid", { skip }, async () => {
  const { status, data } = await call("GET", `/api/products/${PID}`);
  assert.strictEqual(status, 200);
  assert.strictEqual(data.pname, "Test CRUD");
});

test("PUT cập nhật giá và số lượng", { skip }, async () => {
  const { status, data } = await call("PUT", `/api/products/${PID}`, {
    price: 20,
    quantity: 3,
  });
  assert.strictEqual(status, 200);
  assert.strictEqual(data.price, 20);
  assert.strictEqual(data.quantity, 3);
});

test("GET pid không tồn tại trả 404", { skip }, async () => {
  const { status } = await call("GET", "/api/products/987654");
  assert.strictEqual(status, 404);
});

test("DELETE xóa sản phẩm", { skip }, async () => {
  const { status } = await call("DELETE", `/api/products/${PID}`);
  assert.strictEqual(status, 200);
});

test("GET sau khi xóa trả 404", { skip }, async () => {
  const { status } = await call("GET", `/api/products/${PID}`);
  assert.strictEqual(status, 404);
});
