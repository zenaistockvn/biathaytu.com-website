#!/usr/bin/env python3
"""Tách nền trắng của ảnh sản phẩm thành WebP nền trong suốt.

Ảnh chính hãng do nhà máy cung cấp đều chụp studio trên nền trắng. Đặt thẳng lên
khoang ảnh màu đá ấm của card, phần nền trắng đó hiện ra thành một khung trắng
quanh chai/lon. Script xoá nền bằng cách loang (flood fill) từ
viền ảnh vào trong, nên các mảng trắng BÊN TRONG sản phẩm — bọt bia, giấy nhãn,
vỏ thùng — được giữ nguyên; ngưỡng sáng đơn thuần sẽ ăn mất chúng.

Yêu cầu: pip install pillow numpy

    python3 scripts/cutout_product_images.py                # xử lý danh sách mặc định
    python3 scripts/cutout_product_images.py a.jpg b.png    # xử lý file chỉ định
    python3 scripts/cutout_product_images.py --check        # chỉ báo cáo, không ghi file
    python3 scripts/cutout_product_images.py --manifest     # ghi lại bảng tra ảnh đã tách nền

KHÔNG dùng cho ảnh banner Haravan (1080x1080 có chữ, huy hiệu, mặt bàn gỗ):
nền trắng ở đó là khung thiết kế chứ không phải phông chụp, tách ra sẽ vỡ bố cục.
Những ảnh đó được card hoà nền bằng mix-blend-mode thay vì tách nền.
"""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = ROOT / "public" / "images" / "products"

# Ngưỡng coi là nền trắng khi loang từ viền vào.
FLOOD_THRESHOLD = 232
# Dải pixel quanh biên nền được làm mềm alpha theo độ sáng, tránh viền trắng răng cưa.
FEATHER_BAND = 3
FEATHER_FLOOR = 205
WEBP_QUALITY = 88
# Cạnh dài tối đa của bản WebP, khớp với các ảnh đã tách nền trước đó.
MAX_EDGE = 2400


def flood_background(rgb: np.ndarray) -> np.ndarray:
    """Trả về mask nền: pixel gần trắng nối liền với viền ảnh."""
    height, width, _ = rgb.shape
    bright = rgb.min(axis=2) >= FLOOD_THRESHOLD
    background = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for y in range(height):
        for x in (0, width - 1):
            if bright[y, x] and not background[y, x]:
                background[y, x] = True
                queue.append((y, x))
    for x in range(width):
        for y in (0, height - 1):
            if bright[y, x] and not background[y, x]:
                background[y, x] = True
                queue.append((y, x))

    while queue:
        y, x = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < height and 0 <= nx < width and bright[ny, nx] and not background[ny, nx]:
                background[ny, nx] = True
                queue.append((ny, nx))

    return background


def dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    """Nở mask ra `radius` pixel theo 4 hướng."""
    grown = mask.copy()
    for _ in range(radius):
        shifted = grown.copy()
        shifted[1:, :] |= grown[:-1, :]
        shifted[:-1, :] |= grown[1:, :]
        shifted[:, 1:] |= grown[:, :-1]
        shifted[:, :-1] |= grown[:, 1:]
        grown = shifted
    return grown


def cut_out(path: Path) -> tuple[Image.Image, float]:
    """Trả về ảnh RGBA đã tách nền và tỉ lệ pixel bị xoá."""
    source = Image.open(path)
    rgba = np.asarray(source.convert("RGBA")).astype(np.float32)
    rgb = rgba[..., :3]

    background = flood_background(rgb.astype(np.int16))
    alpha = np.where(background, 0.0, rgba[..., 3])

    # Làm mềm mép: pixel sáng nằm sát nền mờ dần theo độ sáng để không đọng
    # quầng trắng khi đặt lên nền đá ấm của card.
    band = dilate(background, FEATHER_BAND) & ~background
    luminance = rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    softness = np.clip((255.0 - luminance) / (255.0 - FEATHER_FLOOR), 0.0, 1.0)
    alpha = np.where(band, np.minimum(alpha, alpha * softness), alpha)

    out = np.dstack([rgb, alpha]).astype(np.uint8)
    image = Image.fromarray(out, "RGBA")
    if max(image.size) > MAX_EDGE:
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
    return image, float(background.mean())


DEFAULT_TARGETS = [
    PRODUCTS_DIR / "official/bitburger/74560_Bitb_Pils_05l_Flasche_Pokal_frontal_betaut_142x291mm.jpg",
    # Ảnh thương hiệu ở trang chủ: nguồn đã là WebP nên được ghi đè tại chỗ.
    ROOT / "public/images/brand/benediktiner-official/dunkel-glass.webp",
    ROOT / "public/images/brand/benediktiner-official/festbier-keg.webp",
]

MANIFEST_PATH = ROOT / "src" / "lib" / "data" / "productImageCutouts.ts"

# Ảnh Haravan (product.hstatic.net) dùng chung khung hình với ảnh chính hãng đã
# tách nền trong repo. Dữ liệu sản phẩm đổ từ database vẫn trỏ vào URL Haravan,
# nên ánh xạ sang bản đã tách nền tại đây.
REMOTE_ALIASES = {
    "https://product.hstatic.net/200000919029/product/riesling_auslese_a286249bffb40c5b2ed798abe388ca2_grande.png":
        "/images/products/official/rappenhof/riesling_auslese_bottle.webp",
    "https://product.hstatic.net/200000919029/product/riesling_kabinett_2f5a9c2ff1874c91b3ee1765b6814e3e_grande.png":
        "/images/products/official/rappenhof/riesling_kabinett_bottle.webp",
    "https://product.hstatic.net/200000919029/product/riesling_trocken_d50b8e7cdd8540f9a290fd83ea36ca75_grande.png":
        "/images/products/official/rappenhof/riesling_trocken_bottle.webp",
    "https://product.hstatic.net/200000919029/product/6_343530997b684b809e3e2d570d7197c1_grande.png":
        "/images/products/official/thorle/kabinett_bottle.webp",
    "https://product.hstatic.net/200000919029/product/9_587336c129e1466391e80e0f5273bcb4_grande.png":
        "/images/products/official/thorle/riesling_750_bottle.webp",
    "https://product.hstatic.net/200000919029/product/1_c3ac6d2d42134f4984a3145fc430d49b_grande.png":
        "/images/products/official/thorle/spatburgunder_bottle.webp",
}


def has_transparency(path: Path) -> bool:
    image = Image.open(path)
    if "A" not in image.getbands():
        return False
    return np.asarray(image.convert("RGBA"))[..., 3].min() < 250


def write_manifest() -> int:
    """Ghi bảng tra: ảnh nền trắng → bản WebP đã tách nền nằm cạnh nó."""
    entries: dict[str, str] = {}
    for source in sorted(PRODUCTS_DIR.rglob("*")):
        if source.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        cutout = source.with_suffix(".webp")
        if not cutout.exists() or not has_transparency(cutout):
            continue
        key = "/" + source.relative_to(ROOT / "public").as_posix()
        entries[key] = "/" + cutout.relative_to(ROOT / "public").as_posix()

    entries.update(REMOTE_ALIASES)

    lines = [
        "// TỆP SINH TỰ ĐỘNG — chạy `python3 scripts/cutout_product_images.py --manifest` để cập nhật.",
        "//",
        "// Ảnh chụp studio của nhà máy và Haravan đều nằm trên nền trắng. Dữ liệu sản phẩm",
        "// đổ từ database vẫn trỏ vào bản gốc đó, nên khoang ảnh màu đá ấm của card hiện ra",
        "// một khung trắng quanh chai. Bảng này trỏ mỗi bản gốc sang bản WebP đã tách nền.",
        "export const PRODUCT_IMAGE_CUTOUTS: Readonly<Record<string, string>> = {",
    ]
    for key, value in sorted(entries.items()):
        lines.append(f"  '{key}': '{value}',")
    lines.append("};")

    MANIFEST_PATH.write_text("\n".join(lines) + "\n", encoding="utf8")
    print(f"{MANIFEST_PATH.relative_to(ROOT)}: {len(entries)} ảnh")
    return 0


def main(argv: list[str]) -> int:
    if "--manifest" in argv:
        return write_manifest()

    check_only = "--check" in argv
    args = [a for a in argv if not a.startswith("--")]
    targets = [Path(a) for a in args] if args else list(DEFAULT_TARGETS)

    for path in targets:
        if not path.exists():
            print(f"bỏ qua (không tồn tại): {path}")
            continue

        if has_transparency(path):
            # Chạy lại trên ảnh đã tách sẽ bào mòn thêm một lớp mép mỗi lần.
            print(f"bỏ qua (đã tách nền): {path.resolve().relative_to(ROOT)}")
            continue

        cut, removed = cut_out(path)
        destination = path.with_suffix(".webp")
        label = destination.resolve().relative_to(ROOT)

        if check_only:
            print(f"{label}: sẽ xoá {removed * 100:.1f}% pixel nền")
            continue

        cut.save(destination, "WEBP", quality=WEBP_QUALITY, method=6)
        size_kb = destination.stat().st_size / 1024
        print(f"{label}: xoá {removed * 100:.1f}% pixel nền, {size_kb:.0f}KB")

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
