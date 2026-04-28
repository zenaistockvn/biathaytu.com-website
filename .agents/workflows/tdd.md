---
description: Quy trình Test-Driven Development (TDD) — RED-GREEN-REFACTOR. Dùng khi viết feature mới, fix bug, refactor.
---

# Test-Driven Development (TDD)

## Iron Law

```
KHÔNG VIẾT PRODUCTION CODE KHI CHƯA CÓ FAILING TEST
```

Đã viết code trước test? **Xóa đi. Bắt đầu lại.**

- Không giữ làm "tham khảo"
- Không "adapt" khi viết test
- Không nhìn vào code cũ
- Xóa nghĩa là xóa

## Khi nào dùng

**Luôn luôn:**
- Feature mới
- Bug fix
- Refactor
- Thay đổi behavior

**Ngoại lệ (hỏi user):**
- Prototype dùng xong bỏ
- Generated code
- Config files

## Quy trình RED-GREEN-REFACTOR

### 1. RED — Viết Failing Test

Viết **một** test tối thiểu mô tả behavior mong muốn.

**Yêu cầu:**
- Một behavior duy nhất
- Tên test rõ nghĩa
- Dùng code thật (không mock trừ khi bắt buộc)

```typescript
// ✅ Tốt — tên rõ, test behavior thật
test('rejects empty email', async () => {
  const result = await submitForm({ email: '' });
  expect(result.error).toBe('Email required');
});

// ❌ Xấu — tên mơ hồ, test mock
test('test1', async () => {
  const mock = jest.fn().mockResolvedValue('ok');
  await doStuff(mock);
  expect(mock).toHaveBeenCalled();
});
```

### 2. Verify RED — Xem test FAIL

**BẮT BUỘC. Không được bỏ qua.**

```bash
npm test path/to/test.test.ts
```

Xác nhận:
- Test **fail** (không phải error)
- Message fail đúng như mong đợi
- Fail vì feature chưa có (không phải typo)

Test pass ngay? → Đang test behavior có sẵn. Sửa lại test.

### 3. GREEN — Code tối thiểu

Viết code **đơn giản nhất** để test pass.

```typescript
// ✅ Tốt — vừa đủ
function submitForm(data: FormData) {
  if (!data.email?.trim()) {
    return { error: 'Email required' };
  }
  // ...
}

// ❌ Xấu — over-engineering (YAGNI)
function submitForm(data: FormData, options?: {
  maxRetries?: number;
  backoff?: 'linear' | 'exponential';
}) { /* ... */ }
```

Không thêm feature, refactor code khác, hay "cải thiện" ngoài test.

### 4. Verify GREEN — Xem test PASS

**BẮT BUỘC.**

```bash
npm test path/to/test.test.ts
```

Xác nhận:
- Test pass
- Các test khác vẫn pass
- Output sạch (không error, warning)

Test fail? → Sửa **code**, không sửa test.

### 5. REFACTOR — Clean up

Chỉ sau khi GREEN:
- Loại bỏ duplication
- Cải thiện naming
- Extract helpers

Giữ test xanh. Không thêm behavior.

### 6. Repeat

Test tiếp theo cho feature tiếp theo.

## Verification Checklist

Trước khi đánh dấu hoàn thành:

- [ ] Mọi function/method mới đều có test
- [ ] Đã xem mỗi test fail trước khi implement
- [ ] Mỗi test fail đúng lý do (feature missing, không phải typo)
- [ ] Viết code tối thiểu để pass mỗi test
- [ ] Tất cả test pass
- [ ] Output sạch (không error, warning)
- [ ] Test dùng code thật (mock chỉ khi bắt buộc)
- [ ] Edge cases và error được cover

## Khi bị stuck

| Vấn đề | Giải pháp |
|---------|-----------|
| Không biết test thế nào | Viết API mong muốn trước. Viết assertion trước. Hỏi user. |
| Test quá phức tạp | Design quá phức tạp. Đơn giản hóa interface. |
| Phải mock hết | Code coupling quá chặt. Dùng dependency injection. |
| Setup test quá lớn | Extract helpers. Vẫn phức tạp? Đơn giản hóa design. |

## Anti-Patterns

| Lý do biện minh | Thực tế |
|-----------------|---------|
| "Quá đơn giản để test" | Code đơn giản vẫn lỗi. Test mất 30 giây. |
| "Viết test sau" | Test pass ngay không chứng minh gì. |
| "Cần explore trước" | OK. Nhưng xong thì xóa đi, bắt đầu lại với TDD. |
| "TDD làm chậm" | TDD nhanh hơn debug. |
| "Đã manual test rồi" | Manual không chứng minh edge cases. |

## Red Flags — DỪNG LẠI và bắt đầu lại

- Code trước test
- Test pass ngay lần đầu
- Không giải thích được tại sao test fail
- "Chỉ lần này thôi"
- "Đã manual test rồi"
- "Giữ lại làm tham khảo"
