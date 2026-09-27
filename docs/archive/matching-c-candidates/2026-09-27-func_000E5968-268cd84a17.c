typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern struct { u16 width, height; u8 unknown04[0x5E]; u8 flags; } D_800E7A58;
extern u8 D_800E7AC1;
extern u32 D_800E7A44;
extern u8 D_800E91D0[];
extern char D_8019E1F8[], D_8019E20C[];
extern u32 D_800E7A48;
extern u32 D_800E7A4C;
extern u16 D_800E7A50;
extern u32 D_800E7A54;
extern u8 D_800E7A34;
extern u8 D_800E7A32;
extern u8 D_800E7A33;
extern u16 D_800E7A30;
extern u8 D_800E7AB8;
extern u8 D_800E7AC6;
extern u8 D_800E7AC7;
extern u8 D_800E7AB9;
extern u8 D_800E7AC2;
extern u8 D_800E7AC3;
extern u8 D_800E7ABB;
extern u8 D_800E7ABD;
extern u8 D_800E7ABC;
extern u8 D_800E7AC5;
extern u8 D_800E7AC4;
extern u8 D_800E7AC0;
extern u8 D_800E7ABE;

typedef struct DialogueState {
    s16 field00;
    u16 field02;
    u8 *text;
    u8 *cursor;
    u8 unknown0C[8];
    s16 portrait;
    u16 field16;
    u16 field18;
    u16 columns;
    u16 field1C;
    u16 rows;
    u16 width;
    u16 height;
    union { s32 packed; struct { u16 x, y; } xy; } start;
    u16 targetX, targetY;
    u16 currentX, currentY;
    s16 pointerX, pointerY;
    u16 field34, textOffset, steps;
    u8 pointerSide, pointerEdge, field3C, portraitSide;
    u8 unknown3E[4];
    u8 field42, field43, field44, field45, field46, style;
    u8 field48, portraitAlpha, portraitVariant, field4B;
    u8 unknown4C[3];
    u8 field4F, field50, field51, field52, field53, firstLine, field55, alpha;
    u8 lineFlags[0x61];
    u16 lineOffsets[0x60];
    u8 textBuffer[0x300];
} DialogueState;

extern DialogueState *D_8019E194;
#define DIALOGUE D_8019E194
#define BYTE(address) (*(u8 *)(address))
#define HALF(address) (*(u16 *)(address))
#define WORD(address) (*(u32 *)(address))
#define FLAGS D_800E7A58.flags
#define CONTROL D_800E7AC1

/* These repeated expressions follow the retail branch trees; they deliberately
 * reload the shared object when used again after stores. */
#define BELOW_LEFT(x) (!(CONTROL & 4) ? \
    (DIALOGUE->style < 2 ? \
        ((DIALOGUE->style == 0 && DIALOGUE->portraitSide == 0) ? \
            (DIALOGUE->portrait >= 0 ? (x) < 56 : (x) < 8) : (x) < 8) : (x) < 7) : ((x) < 0))
#define RIGHT_EDGE (!(CONTROL & 4) ? \
    (DIALOGUE->style < 2 ? \
        (DIALOGUE->style == 0 ? \
            (DIALOGUE->portraitSide ? DIALOGUE->columns * 7 - 1 : \
                DIALOGUE->columns * 7 + (DIALOGUE->portrait >= 0 ? 47 : -1)) : \
            DIALOGUE->columns * 7 - 1) : DIALOGUE->columns * 7 - 2) : DIALOGUE->columns * 7 - 9)
#define LEFT_EDGE (!(CONTROL & 4) ? \
    (DIALOGUE->style < 2 ? \
        (DIALOGUE->style == 0 ? (DIALOGUE->portraitSide ? 8 : (DIALOGUE->portrait >= 0 ? 56 : 8)) : 8) : 7) : 0)

extern void func_000E659C(void);
extern void func_000E65DC(void);
extern void func_000E6620(void);
extern void func_00023780(void *, s32);
extern u8 *boot_command_stream_dispatch(u32, s32, s32, s32);
extern void func_000ea930(void);
extern u16 func_000e98bc(u8 *, s32);
extern u16 func_000e9528(u8 *);
extern void func_00023940(char *, ...);

void func_000E5968(s16 windowId)
{
    u8 *archive = 0;
    s16 preset;
    s32 value;
    s32 left;
    s16 nearLeft, nearRight, outsideLeft;
    u16 width, currentX;
    DialogueState *geometry;

    D_800E7A44 = (u32)func_000E659C;
    D_800E7A48 = (u32)func_000E65DC;
    D_800E7A4C = (u32)func_000E6620;
    D_800E7A50 = 0x478;
    D_800E7A54 = 0;
    D_800E7A34 = 8;
    D_800E7A32 |= 9;
    D_800E7A33 |= 1;
    D_800E7A30 |= 0x200;
    func_00023780(D_800E91D0, 0x478);
    DIALOGUE->field00 = windowId;
    switch (D_800E7AB8 & 0xC0) {
    case 0:
        archive = boot_command_stream_dispatch(0x01A3B7B2,
            (D_800E7AC6 << 8) | D_800E7AC7, -4, 0);
        break;
    case 0x40:
        break;
    case 0x80:
        archive = boot_command_stream_dispatch(0x021B8BA4,
            (D_800E7AC6 << 8) | D_800E7AC7, -4, 0);
        break;
    }
    DIALOGUE->portrait = -1;
    DIALOGUE->portraitAlpha = 255;
    DIALOGUE->cursor = DIALOGUE->text = archive + ((u32 *)archive)[
        ((D_800E7AB8 & 0x3F) << 8) | D_800E7AB9];
    func_000ea930();
    if (DIALOGUE->style == 1) {
        DIALOGUE->columns = 36;
        DIALOGUE->rows = 3;
    } else {
        if (DIALOGUE->columns == 0)
            DIALOGUE->columns = (u32)func_000e98bc(DIALOGUE->text, 0) / 7U + 1;
        if (DIALOGUE->style == 0)
            DIALOGUE->rows = 3;
        else if (DIALOGUE->rows == 0)
            DIALOGUE->rows = func_000e9528(DIALOGUE->text);
    }
    if (DIALOGUE->columns >= 37) DIALOGUE->columns = 36;
    if ((D_800E7AC2 | D_800E7AC3) != 0) {
        DIALOGUE->portrait = (D_800E7AC2 << 8) | D_800E7AC3;
        if (DIALOGUE->portrait < 0) {
            DIALOGUE->portrait = -DIALOGUE->portrait;
            DIALOGUE->portraitVariant = 1;
        } else {
            DIALOGUE->portraitVariant = 0;
        }
    }
    FLAGS &= ~0x10;
    D_800E7A58.width = DIALOGUE->width = !(CONTROL & 4) ?
        (DIALOGUE->style < 2 ? (DIALOGUE->style == 0 ?
            DIALOGUE->columns * 7 + (DIALOGUE->portrait >= 0 ? 67 : 19) :
            DIALOGUE->columns * 7 + 19) : DIALOGUE->columns * 7 + 14) : DIALOGUE->columns * 7;
    D_800E7A58.height = DIALOGUE->height = !(CONTROL & 4) ?
        (DIALOGUE->style < 2 ? 61 : (DIALOGUE->rows-1)*2 + (DIALOGUE->rows*14+14)) :
        (DIALOGUE->rows*14 + (DIALOGUE->style < 2 ? (DIALOGUE->rows-1)*3 : (DIALOGUE->rows-1)*2));
    if (FLAGS & 4) DIALOGUE->portraitSide = 1;
    if (DIALOGUE->portrait >= 999) {
        func_00023940(D_8019E1F8, DIALOGUE->portrait);
        DIALOGUE->portrait = -1;
    }
    if (!(CONTROL & 8)) {
        if (!(FLAGS & 0x40)) {
            DIALOGUE->targetY = (D_800E7ABB >> 4) * 14 + ((s16)DIALOGUE->height / 2 + 19);
            preset = D_800E7ABB & 15;
            if (preset >= 8) func_00023940(D_8019E20C, preset);
            if (preset < 4)
                DIALOGUE->targetX = preset * 22 + ((s16)DIALOGUE->width / 2 + 28);
            else
                DIALOGUE->targetX = ((preset - 4) * 22 - (DIALOGUE->width - 211)) + ((s16)DIALOGUE->width / 2 + 16);
        } else {
            DIALOGUE->targetX = (s16)DIALOGUE->width / 2 + (D_800E7ABD | (D_800E7ABC << 8));
            DIALOGUE->targetY = (s16)DIALOGUE->height / 2 + (D_800E7AC5 | (D_800E7AC4 << 8));
        }
    } else {
        DIALOGUE->targetX = D_800E7AC0 | (D_800E7ABE << 8);
        DIALOGUE->targetY = D_800E7ABB;
    }
    if (FLAGS & 0x80) DIALOGUE->targetX = 160;
    DIALOGUE->start.xy.x = D_800E7ABD | (D_800E7ABC << 8);
    DIALOGUE->start.xy.y = D_800E7AC5 | (D_800E7AC4 << 8);
    if (DIALOGUE->start.packed == 0 || DIALOGUE->style != 0) {
        DIALOGUE->start.xy.x = DIALOGUE->targetX;
        DIALOGUE->start.xy.y = DIALOGUE->targetY;
    }
    DIALOGUE->currentX = DIALOGUE->start.xy.x;
    DIALOGUE->currentY = DIALOGUE->start.xy.y;
    value = D_800E7A34 - 2;
    DIALOGUE->steps = value > 0 ? value : 1;
    if (((s16)DIALOGUE->targetX - (s16)DIALOGUE->currentX > 0 ?
         (s16)DIALOGUE->targetX - (s16)DIALOGUE->currentX : (s16)DIALOGUE->currentX - (s16)DIALOGUE->targetX) >=
        ((s16)DIALOGUE->targetY - (s16)DIALOGUE->currentY > 0 ?
         (s16)DIALOGUE->targetY - (s16)DIALOGUE->currentY : (s16)DIALOGUE->currentY - (s16)DIALOGUE->targetY)) {
        value = (s16)DIALOGUE->targetX - (s16)DIALOGUE->currentX;
        DIALOGUE->steps = (value > 0 ? value : (s16)DIALOGUE->currentX - (s16)DIALOGUE->targetX) / DIALOGUE->steps;
    } else {
        value = (s16)DIALOGUE->targetY - (s16)DIALOGUE->currentY;
        DIALOGUE->steps = (value > 0 ? value : (s16)DIALOGUE->currentY - (s16)DIALOGUE->targetY) / DIALOGUE->steps;
    }
    if (DIALOGUE->steps == 0) DIALOGUE->steps = 1;
    geometry = DIALOGUE;
    width = geometry->width;
    currentX = geometry->currentX;
    left = geometry->targetX - (s16)width / 2;
    nearLeft = currentX - (left + 20);
    nearRight = (width + left - 20) - currentX;
    outsideLeft = currentX - (left - 12);
    if (DIALOGUE->portraitSide == 0) {
        DialogueState *state = DIALOGUE;
        s32 x;
        state->pointerSide = 0;
        state->pointerX = nearLeft;
        x = DIALOGUE->pointerX;
        if (BELOW_LEFT(x) && nearRight >= nearLeft) {
            state = DIALOGUE;
            state->pointerX = outsideLeft;
            state->pointerSide = 1;
        }
    } else {
        DialogueState *state = DIALOGUE;
        s32 x;
        state->pointerSide = 1;
        state->pointerX = outsideLeft;
        x = DIALOGUE->pointerX;
        if (RIGHT_EDGE < x && nearLeft >= nearRight) {
            state = DIALOGUE;
            state->pointerX = nearLeft;
            state->pointerSide = 0;
        }
    }
    {
        s32 x = DIALOGUE->pointerX;
        if (BELOW_LEFT(x)) DIALOGUE->pointerX = LEFT_EDGE;
    }
    {
        s32 x = DIALOGUE->pointerX;
        if (RIGHT_EDGE < x) {
            DIALOGUE->pointerX = !(CONTROL & 4) ?
                (DIALOGUE->style < 2 ?
                    ((DIALOGUE->style == 0 && DIALOGUE->portraitSide == 0) ?
                        DIALOGUE->columns * 7 + (DIALOGUE->portrait >= 0 ? 47 : -1) :
                        DIALOGUE->columns * 7 - 1) : DIALOGUE->columns * 7 - 2) : DIALOGUE->columns * 7 - 9;
        }
    }
    if (!(FLAGS & 8)) {
        DIALOGUE->pointerEdge = 0;
        DIALOGUE->pointerY = DIALOGUE->height - 6;
    } else {
        DIALOGUE->pointerY = -11;
        DIALOGUE->pointerEdge = 1;
    }
}
