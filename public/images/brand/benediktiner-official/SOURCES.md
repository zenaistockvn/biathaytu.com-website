# Benediktiner official image sources

Downloaded on 2026-08-21 from the official Benediktiner Weissbräu website for use on the Bia Thầy Tu brand site.

| Local file | Official source |
| --- | --- |
| `home-hero.jpg` | https://www.benediktiner-weissbier.de/fileadmin/user_upload/startseite/bene_weissbier_header_sommer_1920x970px.jpg |
| `ettal-monastery.jpg` | https://www.benediktiner-weissbier.de/fileadmin/user_upload/unsere-geschichte/unsere-geschichte-kloster.jpg |
| `beer-garden-closeup.jpg` | https://www.benediktiner-weissbier.de/fileadmin/user_upload/startseite/mainteaser-desktop-unsere_biere-01.jpg |

Derived web assets:

- `dunkel-glass-nobg.webp` is an optimized, background-removed derivative of `public/images/products/official/benediktiner/49717_Bene_GL_vO_WB_dunkel.jpg`.
- `festbier-keg-nobg.webp` is an optimized, background-removed derivative of `public/images/products/official/benediktiner/86492_Bene_Festbier_5l_Fass_Abbildung-Export.jpg`.
- Both replace earlier `dunkel-glass.webp` / `festbier-keg.webp`, which kept the white studio backdrop. `/images/*` is served with a one-year immutable cache, so a cut-out version has to ship under a new filename rather than overwrite the old one.

Before using these files outside this website, confirm the current Benediktiner/Bitburger media-database usage terms and brand guidelines.
