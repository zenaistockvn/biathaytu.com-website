---
description: Quy trình Code Review — kiểm tra chất lượng trước khi merge hoặc deploy. Dùng sau khi hoàn thành task, feature lớn, hoặc trước merge.
---

# Code Review

Review sớm, review thường xuyên.

## Khi nào review

**Bắt buộc:**
- Sau khi hoàn thành feature lớn
- Trước merge vào main
- Sau khi fix complex bug

**Tùy chọn nhưng có giá trị:**
- Khi bị stuck (góc nhìn mới)
- Trước khi refactor (baseline check)

## Quy trình review

### 1. Chuẩn bị context

Xác định rõ:
- **Đã implement gì** — mô tả ngắn gọn
- **Requirements là gì** — spec/plan tham chiếu
- **Phạm vi thay đổi** — files nào, lines nào

### 2. Review checklist

**Correctness:**
- [ ] Code làm đúng yêu cầu theo spec/plan
- [ ] Edge cases được handle
- [ ] Error handling đầy đủ
- [ ] Không có regression (tests cũ vẫn pass)

**Code Quality:**
- [ ] Naming rõ nghĩa
- [ ] Không hardcode magic numbers/strings
- [ ] Không code duplication
- [ ] Functions/methods không quá dài (< 50 lines)
- [ ] Files không quá lớn (< 200 lines)

**Type Safety:**
- [ ] Không dùng `any` type
- [ ] Types/interfaces defined đầy đủ
- [ ] Return types rõ ràng

**Testing:**
- [ ] Tests cover happy paths
- [ ] Tests cover error cases
- [ ] Tests cover edge cases
- [ ] Tests dùng code thật (mock chỉ khi bắt buộc)

**UI/UX (nếu có):**
- [ ] Responsive
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Accessibility cơ bản

### 3. Phân loại issues

| Severity | Hành động |
|----------|-----------|
| **Critical** | Fix ngay. Block progress. |
| **Important** | Fix trước khi proceed. |
| **Minor** | Ghi nhận, fix sau. |

### 4. Xử lý feedback

- Fix **Critical** issues ngay lập tức
- Fix **Important** issues trước khi tiếp tục
- Ghi nhận **Minor** issues cho later
- Push back nếu reviewer sai (với lý do kỹ thuật)

## Red Flags

**Không bao giờ:**
- Bỏ review vì "đơn giản quá"
- Ignore Critical issues
- Proceed với Important issues chưa fix
- Argue với valid technical feedback mà không có lý do

**Nếu reviewer sai:**
- Push back với reasoning kỹ thuật
- Show code/tests chứng minh
- Request clarification
