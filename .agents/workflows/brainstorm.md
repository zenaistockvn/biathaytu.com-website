---
description: Quy trình Brainstorming Ideas Into Designs — biến ý tưởng thành thiết kế có cấu trúc. Dùng trước khi implement bất kỳ feature nào.
---

# Brainstorming Ideas Into Designs

Biến ý tưởng thành thiết kế hoàn chỉnh thông qua đối thoại có hệ thống.

## Hard Gate

```
KHÔNG VIẾT CODE, SCAFFOLD, HAY IMPLEMENT GÌ CẢ
CHO ĐẾN KHI DESIGN ĐƯỢC USER DUYỆT
```

Áp dụng cho **MỌI** dự án, bất kể đơn giản thế nào.

## Anti-Pattern: "Cái này đơn giản quá, không cần design"

Mọi project đều đi qua process này. Todo list, utility function, config change — tất cả. Project "đơn giản" chính là nơi assumptions không kiểm tra gây lãng phí nhiều nhất.

Design có thể ngắn (vài câu cho project thật sự đơn giản), nhưng **PHẢI** trình bày và được duyệt.

## Checklist (thực hiện theo thứ tự)

1. **Khám phá project context** — check files, docs, recent commits
2. **Hỏi clarifying questions** — mỗi lần một câu, hiểu mục đích/ràng buộc/tiêu chí
3. **Đề xuất 2-3 phương án** — với trade-offs và khuyến nghị
4. **Trình bày design** — từng phần, user duyệt sau mỗi phần
5. **Viết design doc** — lưu vào `implementation_plan.md`
6. **Self-review spec** — check placeholders, contradictions, ambiguity, scope
7. **User review spec** — chờ user duyệt trước khi proceed
8. **Chuyển sang implementation** — tạo plan chi tiết (xem `/plan`)

## Quy trình chi tiết

### Hiểu ý tưởng

- Check project state hiện tại (files, docs, recent commits) trước
- Đánh giá scope: nếu yêu cầu mô tả nhiều subsystems độc lập → flag ngay, decompose trước
- Với project phạm vi phù hợp, hỏi **một câu một lần**
- Ưu tiên câu hỏi multiple choice, open-ended cũng OK
- Tập trung: mục đích, ràng buộc, tiêu chí thành công

### Khám phá phương án

- Đề xuất **2-3 phương án** với trade-offs
- Lead với phương án khuyến nghị, giải thích tại sao
- Trình bày conversational kèm reasoning

### Trình bày design

- Khi hiểu rõ cần build gì → trình bày design
- Scale mỗi section theo complexity: vài câu nếu straightforward, 200-300 từ nếu nuanced
- Hỏi sau mỗi section xem đúng chưa
- Cover: architecture, components, data flow, error handling, testing
- Sẵn sàng quay lại clarify nếu cần

### Design cho isolation và clarity

- Chia system thành units nhỏ, mỗi unit một mục đích rõ ràng
- Giao tiếp qua well-defined interfaces
- Có thể hiểu và test independently
- Files nhỏ, focused → dễ reasoning, dễ edit chính xác

### Trong codebase hiện có

- Khám phá cấu trúc hiện tại trước khi đề xuất thay đổi
- Follow patterns có sẵn
- Chỉ cải thiện code có vấn đề ảnh hưởng đến công việc hiện tại
- Không refactor không liên quan

## Sau Design

### Self-Review Spec

1. **Placeholder scan:** "TBD", "TODO", sections chưa đầy đủ? → Fix
2. **Internal consistency:** Sections có mâu thuẫn nhau? Architecture match feature descriptions?
3. **Scope check:** Đủ focused cho 1 implementation plan?
4. **Ambiguity check:** Requirement nào có thể hiểu 2 cách? → Pick 1, nói rõ

### User Review Gate

> "Spec đã viết tại `implementation_plan.md`. Xin review và cho biết nếu cần thay đổi trước khi viết implementation plan."

Chờ user response. Nếu cần thay đổi → sửa → re-review. Chỉ proceed khi user approve.

## Key Principles

- **Một câu hỏi một lần** — không overwhelm
- **Multiple choice ưu tiên** — dễ trả lời hơn open-ended
- **YAGNI ruthlessly** — loại bỏ features không cần thiết
- **Explore alternatives** — luôn đề xuất 2-3 phương án
- **Incremental validation** — trình bày, được duyệt, mới tiếp
- **Linh hoạt** — quay lại clarify khi cần
