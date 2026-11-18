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
    u8 pad4C[0x84];
    PanelContent *content;
} Panel;

extern Panel *D_8018FDC0;
extern PanelParameters *D_8023DE34;
extern u16 D_800C4B28;
extern u16 D_800E79B0;
extern u16 D_800E8100;
extern u16 D_800E8700;
extern u8 D_800EB1F0[];

extern Panel *func_000552c0(void);
extern void func_00052284(Panel *);
extern void func_00286544(void);
extern void func_800EA604(void *, s32);

s32 func_002993EC(void)
{
    Panel *head = D_8018FDC0;
    Panel *panel;
    PanelContent *content;
    s32 result = -1;

    if (head == 0) {
        goto missingContent;
    }
    if (head->link04 == 0) {
        return -1;
    }
    panel = func_000552c0();
    if (panel == 0) {
        return -1;
    }
    content = panel->content;
    if (content != 0) {
        goto contentReady;
    }

missingContent:
    return -1;

contentReady:
    switch (content->field5F0) {
    case 0:
        if (panel->field18 != 0xFF) {
            goto done;
        }
        if ((panel->flags & 4) && content->field5FC < content->field5F4) {
            if (((u16 *)D_8018FDC0)[0xD0 / 2] % content->field5FE == 0) {
                content->field5FD++;
            }
            if (content->field5FD >= content->field5F3) {
                content->field5FD = 0;
                content->field5FC++;
            }
        }
        if (content->field5F1 != 0 && (D_800C4B28 & 0x10)) {
            content->field5F0 = 1;
        } else if (content->field5F1 + content->field5F4 < content->field5F5) {
            if (D_800E8100 & 0x8000) {
                func_800EA604(D_800EB1F0, 3);
                content->field5FC = 0;
                content->field5F1 += content->field5F4;
            }
        } else if (content->field5F7 != 0) {
            content->field5F0 = 5;
        } else {
            u16 buttons = D_800E8100;
            if (buttons & 0xC000) {
                func_800EA604(D_800EB1F0, 1);
                content->field5F0 = 3;
                result = -2;
            } else if ((buttons & 0x2020) && D_8023DE34->field64 == 1) {
                func_00286544();
            }
        }
        if (content->field5F2 < content->field5F1) {
            content->field5F2 = content->field5F1;
        }
        return result;

    case 1: {
        u16 buttons;
        s32 oldValue;

        if (!(D_800E79B0 & 0x10)) {
            content->field5F0 = 2;
            break;
        }
        buttons = D_800E8700;
        oldValue = content->field5F1;
        if (buttons & 0x0800) {
            s32 value = oldValue - 1;
            content->field5F1 = value & (~value >> 31);
        } else if (buttons & 0x0400) {
            s32 value = oldValue;
            if (content->field5F2 >= oldValue + 1) {
                value = (u8)value + 1;
            }
            content->field5F1 = value;
        }
        if (oldValue != content->field5F1) {
            func_800EA604(D_800EB1F0, 2);
        }
        return result;
    }

    case 2:
        if (D_800C4B28 & 0x10) {
            content->field5F0 = 1;
            goto done;
        }
        if (content->field5F1 >= content->field5F2) {
            goto resetState;
        }
        if (((u16 *)D_8018FDC0)[0xD0 / 2] & 1) {
            func_800EA604(D_800EB1F0, 2);
            content->field5F1++;
        }
        break;
resetState:
        content->field5F0 = 0;
        break;

    case 3:
        func_00052284(panel);
        content->field5F0++;
        break;
    }

done:
    return result;
}
