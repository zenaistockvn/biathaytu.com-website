---
description: Quy trình Finish Branch — kết thúc development branch với verify, merge/PR/discard options. Dùng sau khi hoàn thành feature, trước khi merge.
---

# Finish Branch Workflow

Kết thúc development branch một cách có hệ thống.

## Bước 1: Verify Tests
```bash
npm test  # Hoặc test command phù hợp
```
- Nếu tests FAIL → fix trước, KHÔNG tiếp tục

## Bước 2: Xác định base branch
```bash
git merge-base HEAD main
```

## Bước 3: Chọn option
1. **Merge locally** → merge vào base branch + delete feature branch
2. **Push & Create PR** → push + tạo PR trên GitHub
3. **Keep as-is** → giữ nguyên branch + worktree
4. **Discard** → xóa toàn bộ (cần xác nhận 'discard')

## Bước 4: Cleanup
- Option 1 & 4: Cleanup worktree nếu có
- Option 2 & 3: Giữ worktree
