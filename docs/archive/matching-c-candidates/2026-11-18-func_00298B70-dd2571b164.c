typedef unsigned int u32;
typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;

typedef struct PanelParameters {
    u16 *field00;
    u8 *field04;
    void *field08;
    void *field0C;
    void *field10;
    void *field14;
    u16 field18;
    u16 field1A;
    u16 field1C;
    u8 pad1E[2];
    u16 field20;
    u16 field22;
    u8 field24[0x40];
    u8 field64;
    u8 field65;
    u8 field66;
    u8 field67;
} PanelParameters;

typedef struct PanelContent {
    u8 text[0x500];
    u8 pad500[0x30];
    u8 *rows[48];
    u8 field5F0;
    u8 field5F1;
    u8 field5F2;
    u8 field5F3;
    u8 field5F4;
    u8 field5F5;
    u8 field5F6;
    u8 field5F7;
    u8 pad5F8[4];
    u8 field5FC;
    u8 field5FD;
    u8 field5FE;
    u8 pad5FF;
    s32 key;
} PanelContent;

typedef struct Panel {
    struct Panel *link00;
    struct Panel *link04;
    u8 pad08[0xC];
    u8 flags;
    u8 pad15;
    u16 field16;
    s16 field18;
    u8 pad1A[8];
    u8 field22;
    u8 field23;
    s8 field24;
    u8 field25;
    u8 pad26[6];
    s32 field2C;
    s32 field30;
    s32 field34;
    s32 field38;
    u8 pad3C[4];
    s32 field40;
    u8 pad44[4];
    s32 field48;
    s32 field4C;
    s32 field50;
    s32 field54;
    s32 field58;
    u8 pad5C[0x74];
    PanelContent *content;
} Panel;


typedef struct PanelSlot {
    s32 key;
    void *field04;
    void *field08;
    Panel *panel;
    void *field10;
    s16 status;
    u8 pad16[2];
} PanelSlot;

typedef struct PanelScene {
    u8 pad0000[0x19B8];
    PanelSlot *slots[14];
} PanelScene;

extern PanelScene *D_8022A974;
extern u16 D_800C4B28;
extern u16 D_800E8700;
extern u8 D_800EB1F0[];
extern void func_00052284(Panel *);
extern void func_800EA604(void *, s32);
extern s32 func_00295574(s32);
extern void func_002950A0(PanelContent *, s32, PanelSlot *);
extern void func_00294B8C(PanelContent *, u16, PanelSlot *);
extern void func_002956F8(PanelContent *, s32, PanelSlot *);

s32 func_00298B70(Panel *panel, PanelSlot *slot)
{
    PanelContent *content = panel->content;
    u8 refresh = 0;
    s32 status = -1;
    u16 buttons;
    u8 adjustedSelection;
    s32 step;

    switch (content->field5F0) {
    case 3:
        func_00052284(panel);
        content->field5F0++;
        goto returnStatus;

    case 6:
        if (panel->field18 != 0xFF) {
            goto returnStatus;
        }
        break;

    default:
        goto returnStatus;
    }

    buttons = D_800C4B28;
    if (buttons & 0x8000) {
        func_00052284(panel);
        status = content->field5FC;
        content->field5F0 = 3;
        func_800EA604(D_800EB1F0, 3);
    } else if (buttons & 0x4000) {
        func_800EA604(D_800EB1F0, 1);
        status = panel->field24;
        if (content->field5FD == 16) {
            PanelSlot *other = D_8022A974->slots[5];
            if (other != 0) {
                Panel *linked = other->panel;
                linked->field4C = 31;
                linked->field50 = 20;
                linked->field54 = 289;
                linked->field58 = 20;
            }
        }
        func_00052284(panel);
        content->field5F0 = 3;
    } else {
        buttons = D_800E8700;
        if (buttons & 0x0800) {
            u8 old = content->field5FC;
            u8 selected = old - 1;
            if (old != 0) {
                content->field5FC = selected;
                if (content->field5FD == 16) {
                    if (selected == 0) {
                        goto restoreSelection;
                    }
                    content->field5FC -= func_00295574(selected);
                    func_800EA604(D_800EB1F0, 2);
                    goto clampStart;
                }
            playPrevious:
                func_800EA604(D_800EB1F0, 2);
            }

clampStart:
            selected = content->field5FC;
            refresh = 1;
            if (content->field5F1 < selected) {
                goto refreshContent;
            }
            content->field5F1 = selected;
            if (content->field5FD != 16) {
                goto refreshContent;
            }
            if (content->field5FC == 1) {
                goto resetStart;
            }
            goto checkRefresh;

restoreSelection:
            content->field5FC = old;
            goto clampStart;
resetStart:
            content->field5F1 = 0;
            goto refreshContent;
        } else if (buttons & 0x0400) {
            u8 selected = content->field5FC;

            if (content->field5F5 != selected + 1) {
                u8 next = selected + 1;
                content->field5FC = next;
                func_800EA604(D_800EB1F0, 2);
                if (content->field5FD == 16) {
                    content->field5FC += func_00295574(content->field5FC);
                }
            }
            {
            u8 start = content->field5F1;
            u8 visible = content->field5F4;
            if (content->field5FC - (start & 0xFF) < visible) {
                goto refreshContent;
            }
            if (content->field5F5 - visible == (start & 0xFF)) {
                goto refreshContent;
            }
            {
                u8 next = start + 1;
                content->field5F1 = next;
                if (content->field5FD != 16) {
                    goto refreshContent;
                }
                if ((s16)func_00295574(next + 6) == 0) {
                    content->field5F1 += func_00295574(content->field5FC - 1);
                }
            }
            goto refreshContent;
            }
        } else if (buttons & 4) {
            if (content->field5F1 + content->field5F4 < content->field5F5) {
                u8 selected;
                u8 start;

                func_800EA604(D_800EB1F0, 2);
                start = content->field5F1 + 1;
                selected = content->field5FC;
                content->field5F1 = start;
                if (selected < start) {
                    content->field5FC = selected + 1;
                }
                if (content->field5FD == 16) {
                    u8 current = content->field5FC;
                    step = (s32)((u32)(u16)func_00295574(current) << 16) >> 16;
                    current = content->field5FC;
                    if (content->field5F5 < current + content->field5F4 + step) {
                        adjustedSelection = current + step;
                        goto storeSelection;
                    }
                    content->field5FC = current + step;
                    content->field5F1 += step;
                }
            }
            goto refreshContent;
        } else if (buttons & 8) {
            if (content->field5F1 != 0) {
                u8 selected;
                u8 start;

                func_800EA604(D_800EB1F0, 2);
                start = content->field5F1 - 1;
                selected = content->field5FC;
                content->field5F1 = start;
                if (selected >= start + content->field5F4) {
                    content->field5FC = selected - 1;
                }
                if (content->field5FD == 16) {
                    if (content->field5FC == 0) {
                        content->field5FC++;
                    }
                    step = (s32)((u32)(u16)func_00295574(content->field5FC) << 16) >> 16;
                    if (content->field5F1 != 0) {
                        content->field5F1 -= step;
                    }
                    if (content->field5FC != 0) {
                        content->field5FC -= step;
                    }
                }
            }
            goto refreshContent;
        } else if (buttons & 1) {
            u8 limit = content->field5F5;
            u8 start = content->field5F1;
            u8 visible = content->field5F4;

            s32 total = limit & 0xFF;
            s32 first = start & 0xFF;
            s32 width = visible & 0xFF;

            if (first + width * 2 < total) {
                u8 next;
                content->field5F1 = start + visible;
                next = content->field5F1;
                if (content->field5FC < next) {
                    content->field5FC = next;
                }
                func_800EA604(D_800EB1F0, 2);
                refresh = 1;
                if (content->field5FD == 16) {
                    step = (s32)((u32)(u16)func_00295574(content->field5FC) << 16) >> 16;
                    content->field5FC -= step;
                    content->field5F1 -= step;
                }
            } else if (first + width < total) {
                u8 next;
                content->field5F1 = limit - visible;
                next = content->field5F1;
                if (content->field5FC < next) {
                    content->field5FC = next;
                }
                func_800EA604(D_800EB1F0, 2);
                refresh = 1;
                if (content->field5FD == 16) {
                    content->field5FC += func_00295574(content->field5FC);
                }
            } else {
                goto refreshContent;
            }
        } else if (buttons & 2) {
            u8 start = content->field5F1;
            u8 visible = content->field5F4;
            s32 delta = (s32)((u32)(u8)start << 24 >> 24) - visible;

            if (delta >= 0) {
                s32 next = start - visible;
                s32 rowCount;
                content->field5F1 = next;
                rowCount = content->field5F4;
                if (content->field5FC >= rowCount + (u8)next) {
                    content->field5FC = next + rowCount - 1;
                }
                func_800EA604(D_800EB1F0, 2);
                refresh = 1;
                if (content->field5FD == 16) {
                    step = (s32)((u32)(u16)func_00295574(content->field5FC) << 16) >> 16;
                    content->field5FC += step;
                    content->field5F1 += step;
                }
            } else {
                if ((u8)start != 0) {
                    s32 rowCount;
                    content->field5F1 = 0;
                    rowCount = content->field5F4;
                    if (content->field5FC >= rowCount) {
                        content->field5FC = rowCount - 1;
                    }
                    func_800EA604(D_800EB1F0, 2);
                    if (content->field5FD != 16) {
                        goto refreshContent;
                    }
                    refresh = 1;
                    if ((s16)func_00295574(content->field5FC) != 1) {
                        goto checkRefresh;
                    }
                    adjustedSelection = content->field5FC - 1;
                    goto storeSelection;
                }
                goto refreshContent;
            }
        }
    }
    goto checkRefresh;

storeSelection:
    content->field5FC = adjustedSelection;
refreshContent:
    refresh = 1;
checkRefresh:
    if (refresh == 1) {
        switch (content->field5FD) {
        case 6:
            func_002950A0(content, content->field5F1, slot);
            break;
        case 11:
            func_00294B8C(content, content->field5F1, slot);
            break;
        case 16:
            func_002956F8(content, content->field5F1, slot);
            break;
        }
    }

returnStatus:
    return status;
}

