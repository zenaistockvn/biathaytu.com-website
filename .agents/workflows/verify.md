---
description: Quy trình Verification — kiểm chứng trước khi claim hoàn thành. Dùng TRƯỚC KHI claim work is done, fixed, hoặc passing.
---

# Verification Before Completion Workflow

Kiểm chứng bắt buộc trước mọi claim hoàn thành.

## The Gate Function
TRƯỚC khi claim bất kỳ status nào:

1. **IDENTIFY**: Command nào chứng minh claim này?
2. **RUN**: Execute FULL command (fresh, complete)
3. **READ**: Đọc full output, check exit code
4. **VERIFY**: Output có confirm claim không?
   - Nếu KHÔNG → State actual status với evidence
   - Nếu CÓ → State claim VỚI evidence
5. **ONLY THEN**: Được phép claim

## Red Flags — STOP ngay nếu:
- Đang dùng "should", "probably", "seems to"
- Đang express satisfaction trước verification
- Sắp commit/push/PR mà chưa verify
- Đang trust agent success reports
- Đang rely on partial verification

## Common Verifications

| Claim | Cần chạy | Không đủ |
|-------|----------|----------|
| Tests pass | Test output: 0 failures | Previous run |
| Build OK | Build exit 0 | Linter passing |
| Bug fixed | Original symptom passes | "Code changed" |
| Requirements met | Line-by-line checklist | Tests passing |
