---
description: Quy trình Parallel Agents — dispatch nhiều agent làm việc song song cho các task independent. Dùng khi có 2+ task không phụ thuộc nhau.
---

# Parallel Agents Workflow

Dispatch nhiều agent làm việc đồng thời trên các task độc lập.

## Bước 1: Xác định independence
- Các task có shared state không? → Nếu có, KHÔNG parallel
- Các task edit cùng file không? → Nếu có, KHÔNG parallel
- Mỗi task có thể hiểu riêng lẻ không? → Nếu không, KHÔNG parallel

## Bước 2: Nhóm tasks theo domain
- Group failures/tasks theo subsystem
- Mỗi group = 1 agent

## Bước 3: Tạo focused prompts
Mỗi agent cần:
- **Specific scope**: 1 file/subsystem cụ thể
- **Clear goal**: Kết quả mong đợi
- **Constraints**: Không được thay đổi code ngoài scope
- **Expected output**: Summary format

## Bước 4: Dispatch & Monitor
- Dispatch tất cả agents cùng lúc
- Chờ tất cả return

## Bước 5: Review & Integrate
1. Đọc summary từ mỗi agent
2. Verify không có conflicts
3. Chạy full test suite
4. Integrate changes
