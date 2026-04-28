---
description: Quy trình Writing Implementation Plans — chia nhỏ công việc thành task 2-5 phút. Dùng sau khi design được duyệt, trước khi bắt đầu code.
---

# Writing Implementation Plans

Viết implementation plans chi tiết giả định engineer có **zero context**, cần biết: file nào cần touch, code gì, cách test, docs cần check.

## Nguyên tắc

- **DRY** — Don't Repeat Yourself
- **YAGNI** — You Aren't Gonna Need It
- **TDD** — Test-Driven Development (xem `/tdd`)
- **Frequent commits** — commit thường xuyên

## Scope Check

Nếu spec cover nhiều subsystems độc lập → tách thành separate plans, mỗi plan sản xuất phần mềm testable riêng.

## File Structure

Trước khi define tasks, map ra files sẽ tạo/sửa và trách nhiệm của mỗi file:

- Design units với boundaries rõ ràng, interfaces well-defined
- Mỗi file một trách nhiệm duy nhất
- Prefer file nhỏ, focused hơn file lớn làm quá nhiều việc
- Files thay đổi cùng nhau → đặt cùng nhau
- Trong codebase hiện có → follow patterns có sẵn

## Bite-Sized Tasks (2-5 phút mỗi step)

Mỗi step là **MỘT action:**
- "Viết failing test" — 1 step
- "Chạy test xem fail" — 1 step
- "Implement code minimal" — 1 step
- "Chạy test xem pass" — 1 step
- "Commit" — 1 step

## Task Structure

```markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts`
- Test: `tests/exact/path/to/test.ts`

- [ ] **Step 1: Viết failing test**

\```typescript
test('specific behavior', () => {
  const result = functionName(input);
  expect(result).toBe(expected);
});
\```

- [ ] **Step 2: Chạy test, verify fail**

Run: `npm test tests/path/test.ts`
Expected: FAIL với "functionName is not defined"

- [ ] **Step 3: Implement minimal code**

\```typescript
function functionName(input: InputType): OutputType {
  return expected;
}
\```

- [ ] **Step 4: Chạy test, verify pass**

Run: `npm test tests/path/test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

\```bash
git add tests/path/test.ts src/path/file.ts
git commit -m "feat: add specific feature"
\```
```

## No Placeholders — TUYỆT ĐỐI

Những thứ sau là **plan failures**, KHÔNG BAO GIỜ viết:
- "TBD", "TODO", "implement later"
- "Add appropriate error handling" / "handle edge cases"
- "Write tests for the above" (không có actual test code)
- "Similar to Task N" (lặp lại code — engineer có thể đọc tasks không theo thứ tự)
- Steps mô tả WHAT mà không show HOW (code blocks required)
- References đến types/functions chưa defined

## Mỗi step phải có

- ✅ Exact file paths
- ✅ Complete code trong mỗi step
- ✅ Exact commands với expected output
- ✅ DRY, YAGNI, TDD, frequent commits

## Self-Review

Sau khi viết plan xong, check:

1. **Spec coverage:** Mỗi section/requirement trong spec có task implement không? List gaps.
2. **Placeholder scan:** Search các patterns từ "No Placeholders" section. Fix.
3. **Type consistency:** Types, method signatures, property names giữa các tasks có khớp nhau không?

Tìm thấy issues → fix inline. Tìm spec requirement không có task → thêm task.
