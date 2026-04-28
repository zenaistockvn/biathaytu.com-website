---
description: Quy trình Git Worktree — tạo workspace isolated cho feature/bugfix. Dùng trước khi bắt đầu implement feature mới cần isolation.
---

# Git Worktree Workflow

Tạo workspace isolated bằng git worktree.

## Bước 1: Kiểm tra directory
1. Check `.worktrees/` hoặc `worktrees/` có tồn tại chưa
2. Nếu có → dùng luôn
3. Nếu không → hỏi user chọn location

## Bước 2: Verify .gitignore
1. Chạy: `git check-ignore -q .worktrees`
2. Nếu chưa ignored → thêm vào `.gitignore` + commit

## Bước 3: Tạo Worktree
```bash
git worktree add .worktrees/<branch-name> -b <branch-name>
cd .worktrees/<branch-name>
```

## Bước 4: Setup dependencies
```bash
# Auto-detect project type
npm install  # Node.js
```

## Bước 5: Verify baseline
```bash
npm test  # Hoặc test command phù hợp
```

## Bước 6: Report
- Nếu tests pass → Ready to implement
- Nếu tests fail → Report failures + hỏi user
