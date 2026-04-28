---
description: Quy trình Execute Plan — thực thi implementation plan từng bước với review checkpoints. Dùng khi có plan đã được duyệt và muốn bắt đầu code.
---

# Execute Plan Workflow

Thực thi implementation plan đã được phê duyệt.

## Bước 1: Load Plan
1. Đọc file plan (ví dụ: `docs/superpowers/plans/*.md`)
2. Review từng task — xác định concerns hoặc câu hỏi
3. Nếu có concern → hỏi user trước khi bắt đầu

## Bước 2: Chọn execution mode
- **Subagent-Driven (khuyến nghị)**: Dùng skill `subagent-driven-development` — mỗi task dispatched cho 1 fresh subagent + 2-stage review
- **Inline Execution**: Dùng skill `executing-plans` — batch execution với checkpoints

## Bước 3: Execute Tasks
Với mỗi task:
1. Mark as in_progress
2. Follow từng step chính xác như plan
3. Chạy verification theo plan
4. Mark as completed

## Bước 4: Kết thúc
- Sau khi tất cả tasks hoàn thành → dùng skill `finishing-a-development-branch`
- Verify tests → Present options → Execute choice → Clean up
