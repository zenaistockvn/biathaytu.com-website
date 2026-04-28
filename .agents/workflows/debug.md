---
description: Quy trình Systematic Debugging 4 phase — tìm root cause trước khi fix. Dùng khi gặp bug, test fail, behavior bất thường, performance issue.
---

# Systematic Debugging

## Iron Law

```
KHÔNG SỬA KHI CHƯA TÌM ĐƯỢC ROOT CAUSE
```

Chưa hoàn thành Phase 1? → Không được đề xuất fix.

## Khi nào dùng

Dùng cho **MỌI** vấn đề kỹ thuật:
- Test failures, bugs, unexpected behavior
- Performance problems, build failures
- Integration issues

**ĐẶC BIỆT** dùng khi:
- Đang áp lực thời gian (lúc gấp hay đoán mò nhất)
- "Chỉ sửa nhanh một cái" có vẻ hiển nhiên
- Đã thử nhiều fix mà chưa được
- Fix trước không work
- Chưa hiểu rõ vấn đề

## 4 Phases

### Phase 1: Root Cause Investigation

**TRƯỚC KHI thử fix bất kỳ:**

1. **Đọc kỹ Error Messages**
   - Không bỏ qua errors/warnings
   - Đọc hết stack traces
   - Ghi nhận line numbers, file paths, error codes

2. **Tái hiện ổn định**
   - Có trigger được reliably không?
   - Các bước chính xác là gì?
   - Xảy ra mỗi lần không?
   - Không tái hiện được → thu thập thêm data, KHÔNG đoán

3. **Check Recent Changes**
   - Thay đổi gì có thể gây ra lỗi?
   - Git diff, recent commits
   - Dependencies mới, config changes
   - Khác biệt môi trường

4. **Thu thập evidence (hệ thống multi-component)**
   ```
   Với MỖI ranh giới component:
     - Log data vào component
     - Log data ra khỏi component
     - Verify environment/config propagation
     - Check state tại mỗi layer
   
   Chạy 1 lần → thu evidence CHỖ NÀO bị break
   → Phân tích evidence → Xác định component lỗi
   → Điều tra component đó
   ```

5. **Trace Data Flow**
   - Bad value bắt nguồn từ đâu?
   - Cái gì gọi function này với bad value?
   - Trace ngược lên đến source
   - **Fix tại source, không fix tại symptom**

### Phase 2: Pattern Analysis

1. **Tìm Working Examples** — code tương tự đang chạy tốt trong codebase
2. **So sánh với References** — đọc reference implementation HOÀN TOÀN, không skim
3. **Xác định Differences** — list mọi khác biệt, dù nhỏ
4. **Hiểu Dependencies** — components, settings, config, assumptions

### Phase 3: Hypothesis and Testing

1. **Đặt giả thuyết rõ ràng:** "Tôi nghĩ X là root cause vì Y"
2. **Test tối thiểu:** Thay đổi NHỎ NHẤT có thể, một biến một lần
3. **Verify trước khi tiếp:**
   - Đúng → Phase 4
   - Sai → Giả thuyết MỚI (không chồng fix)
4. **Khi không biết:** Nói "Tôi chưa hiểu X", không giả vờ biết

### Phase 4: Implementation

1. **Tạo Failing Test cho bug** — reproduction đơn giản nhất
2. **Implement Single Fix** — một thay đổi, không "tiện tay" cải thiện
3. **Verify Fix** — test pass? Các test khác OK? Vấn đề thực sự resolved?
4. **Nếu fix không work:**
   - Đã thử < 3 fix → Quay lại Phase 1
   - **Đã thử ≥ 3 fix → DỪNG, question architecture**

### Khi 3+ fix thất bại: Question Architecture

**Dấu hiệu vấn đề kiến trúc:**
- Mỗi fix reveal shared state/coupling mới
- Fix đòi hỏi "massive refactoring"
- Mỗi fix tạo symptoms mới chỗ khác

**DỪNG LẠI và hỏi:**
- Pattern này có fundamentally sound không?
- Có đang "cố giữ vì quá trễ" không?
- Nên refactor architecture thay vì tiếp tục fix?

**Thảo luận với user trước khi thử thêm fix.**

## Red Flags — DỪNG và quay lại Phase 1

- "Sửa nhanh bây giờ, tìm hiểu sau"
- "Thử đổi X xem có được không"
- "Thêm nhiều thay đổi, chạy test"
- "Bỏ test, verify thủ công"
- "Chắc là X, sửa luôn"
- "Chưa hiểu hết nhưng thử cái này"
- Đề xuất solutions trước khi trace data flow
- "Thử fix một lần nữa" (đã thử 2+ lần)

## Common Rationalizations

| Lý do | Thực tế |
|-------|---------|
| "Vấn đề đơn giản, không cần process" | Vấn đề đơn giản cũng có root cause. Process nhanh cho bug đơn giản. |
| "Khẩn cấp, không có thời gian" | Systematic debugging NHANH HƠN đoán mò. |
| "Thử fix trước, investigate sau" | Fix đầu tiên tạo pattern. Làm đúng từ đầu. |
| "Nhiều fix cùng lúc nhanh hơn" | Không isolate được cái nào work. Gây bug mới. |

## Quick Reference

| Phase | Hoạt động | Tiêu chí thành công |
|-------|-----------|---------------------|
| 1. Root Cause | Đọc errors, reproduce, check changes | Hiểu WHAT và WHY |
| 2. Pattern | Tìm working examples, so sánh | Xác định differences |
| 3. Hypothesis | Đặt giả thuyết, test minimal | Confirmed hoặc hypothesis mới |
| 4. Implementation | Tạo test, fix, verify | Bug resolved, tests pass |

## Impact thực tế

- Systematic approach: **15-30 phút** để fix
- Random fixes: **2-3 giờ** loay hoay
- First-time fix rate: **95%** vs 40%
- Bug mới phát sinh: Gần 0 vs thường xuyên
