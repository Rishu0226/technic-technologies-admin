# Technic Admin — Design

Light theme only, using the same Technic tokens as the public site. The admin is a productivity surface: white panels on `#F5FAFC`, cyan for interaction, orange only as a small accent. There is no dark mode.

## Tokens

Defined in `src/app/globals.css`. Use `technic-*` utilities and `.tn-input` / `.tn-label` instead of raw hex values in components.

| Role | Value |
| --- | --- |
| Page background | `#F5FAFC` |
| Sidebar, header, cards, tables, forms | `#FFFFFF` |
| Border | `#E5E7EB` |
| Primary text | `#1F2937` |
| Body | `#4B5563` |
| Muted | `#6B7280` |
| Active nav | `#E8F9FC` background, `#0797B2` text, `#10B8D4` left border |
| Primary action | `linear-gradient(135deg, #10B8D4, #FF8A00)` |
| Delete | `#DC2626` |

## Status

| State | Fill | Text |
| --- | --- | --- |
| Published, Hired, Responded | `#DCFCE7` | `#16A34A` |
| Draft, Read, Archived | `#F3F4F6` | `#6B7280` |
| New | `#E8F9FC` | `#0797B2` |
| Reviewing, Interview | `#FFF3E6` | `#E86F00` |
| Rejected, error | `#FEE2E2` | `#DC2626` |

The UI font is Geist. The logo is `/Assest/logo-brand.png`.
