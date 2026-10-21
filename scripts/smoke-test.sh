#!/usr/bin/env bash
# Smoke test CRUD cho product-api. Dùng: bash scripts/smoke-test.sh [BASE_URL]
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
API="$BASE_URL/api/products"
PID=9100
BODY="$(mktemp)"
trap 'rm -f "$BODY"' EXIT

JSON=(-H "Content-Type: application/json")

http() { curl -s -o "$BODY" -w "%{http_code}" "$@"; }

expect() {
  if [ "$1" = "$2" ]; then
    echo "OK   $3"
  else
    echo "FAIL $3 (mong doi $2, nhan $1)"
    cat "$BODY"; echo
    exit 1
  fi
}

# dọn dữ liệu còn sót từ lần chạy trước
http -X DELETE "$API/$PID" > /dev/null || true

expect "$(http "$BASE_URL/health")" 200 "GET /health"
expect "$(http -X POST "$API" "${JSON[@]}" -d "{\"pid\":$PID,\"pname\":\"Smoke test\",\"price\":10,\"quantity\":5}")" 201 "POST tao san pham"
expect "$(http -X POST "$API" "${JSON[@]}" -d "{\"pid\":$PID,\"pname\":\"Trung pid\",\"price\":1,\"quantity\":1}")" 409 "POST trung pid bi tu choi"
expect "$(http "$API")" 200 "GET danh sach"
grep -q "\"pid\":$PID" "$BODY" || { echo "FAIL danh sach khong chua pid $PID"; exit 1; }
expect "$(http "$API/$PID")" 200 "GET mot san pham"
expect "$(http -X PUT "$API/$PID" "${JSON[@]}" -d '{"price":20,"quantity":3}')" 200 "PUT cap nhat"
grep -q '"price":20' "$BODY" || { echo "FAIL gia chua duoc cap nhat"; exit 1; }
expect "$(http -X DELETE "$API/$PID")" 200 "DELETE xoa san pham"
expect "$(http "$API/$PID")" 404 "GET sau khi xoa tra 404"

echo "Tat ca kiem tra deu dat"