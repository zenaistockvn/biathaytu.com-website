---
description: Quy trình Subagent-Driven Development — dispatch subagent cho từng task với 2-stage review. Dùng khi execute plan với các task independent trong cùng session.
---

# Subagent-Driven Development Workflow

Execute plan bằng cách dispatch fresh subagent cho từng task, với 2-stage review.

## Bước 1: Chuẩn bị
1. Đọc plan file (toàn bộ)
2. Extract tất cả tasks với full text + context
3. Tạo task tracking list

## Bước 2: Per-Task Cycle
Với mỗi task:

### 2a. Dispatch Implementer
- Cung cấp: full task text + project context
- KHÔNG cho subagent tự đọc plan file
- Chờ implementer hoàn thành hoặc hỏi questions

### 2b. Spec Compliance Review
- Dispatch spec reviewer subagent
- Verify code matches spec exactly
- Nếu FAIL → implementer fix → re-review

### 2c. Code Quality Review
- Dispatch code quality reviewer subagent
- Check code quality, patterns, naming
- Nếu FAIL → implementer fix → re-review

### 2d. Mark Complete
- Mark task done trong tracking list

## Bước 3: Final Review
- Dispatch final code reviewer cho toàn bộ implementation
- Verify integration across all tasks

## Bước 4: Finish
- Dùng skill `finishing-a-development-branch`

## Red Flags
- KHÔNG skip reviews
- KHÔNG dispatch parallel implementers (conflicts)
- KHÔNG start code quality review trước khi spec compliance ✅
