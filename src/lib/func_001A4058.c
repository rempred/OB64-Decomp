#include "game/sound_channel.h"

typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
typedef struct {
    u16 flags;
    u8 flags2;
    u8 flags3;
    u8 unk04[2];
    s16 x;
    s16 y;
    s16 x2;
    s16 y2;
    u16 unk0E;
    void *owner;
    u8 unk14[0x14];
    s16 unk28;
    s16 unk2A;
    u8 unk2C[0xC];
    void *slotsA[10];
    void *slotsB[10];
    u8 unk88;
    u8 unk89;
    u8 unk8A;
    u8 unk8B;
    u8 unk8C;
    u8 unk8D;
    u8 unk8E;
    u8 unk8F;
    u8 unk90[4];
    u8 unk94;
    u8 unk95;
    u8 unk96;
    u8 unk97;
    u8 unk98[0xA];
    s16 parent;
    u8 unkA4[4];
} Scene;
extern Scene g_state_slot_records[];
typedef struct {
    f32 persp[5];
    f32 eye[3];
    f32 at[3];
    f32 up[3];
    s32 rest[8];
} Camera;
typedef struct {
    Camera *cam;
    Camera *saved;
} CamSave;
typedef struct {
    void *image;
} TexRef;
typedef struct {
    s16 unk00;
    CamSave cs;
    TexRef tex;
    s16 unk10;
    s16 unk12;
    s16 unk14;
    s16 unk16;
    s16 unk18;
    f32 scaleX;
    f32 scaleY;
    u8 unk24[0xC];
    void *unk30;
    u8 unk34[6];
    s16 alpha;
    f32 unk3C;
    f32 unk40;
    u8 unk44[0x10];
} FadeCtx;
extern u16 *D_801AB850;
extern u8 D_801F365D;
extern s32 D_8018F590;
extern u16 *D_800C4BDC;
extern u16 *D_801F0CA0;
extern s32 D_801F0DE0;
extern s32 D_801F0DE8;
extern u8 D_800E7A90[];
extern u8 D_800EB0B0[];
extern FadeCtx *D_80216BE0;
extern u8 D_80216BE4;
extern u16 D_80216F70;
extern s16 D_80216F8C;
void *func_000016C4(void *pointer);
s16 D_801AB0FC(u16 a, s32 b);
void D_800EA7E4(SoundChannel *ch, s32 v);
void D_8017BED4(void);
s32 func_001A3180(void);
void D_801C9AA4(void);
extern inline void func_80214F80_ovl_1A2C20(void) {
    D_80216F8C = D_801AB0FC(*D_801AB850, 0x3C);
    g_state_slot_records[D_80216F8C].unk89 = 9;
    D_80216F70 |= 0x20;
    D_800EA7E4((SoundChannel *)D_800EB0B0, 300);
}
extern inline void func_8021562C_ovl_1A2C20(void) {
    CamSave *cs = &D_80216BE0->cs;
    *cs->cam = *cs->saved;
    func_000016C4((u8 *)cs->saved);
    func_000016C4((u8 *)D_80216BE0);
    D_80216BE0 = ((void *)0);
    D_80216BE4 = 0;
}
void func_001A3490(void);
s32 func_001A4058(void) {
    s32 state;
    s32 ret = 0;
    D_801F365D |= 1;
    state = D_80216BE4;
    if (state == 0) {
        D_8018F590 = 1;
        D_8017BED4();
        func_001A3180();
    }
    if ((*D_800C4BDC & D_801F0CA0[0]) || (*D_800C4BDC & D_801F0CA0[1])) {
        if (state == 4) {
            func_80214F80_ovl_1A2C20();
        }
    }
    if (state == 1) {
        func_8021562C_ovl_1A2C20();
        ret = -3;
        D_801F0DE0 = 0;
        D_801F0DE8 = 0;
        D_801F365D &= ~1;
        g_state_slot_records[D_800E7A90[0x29]].unk8B &= ~4;
        D_801C9AA4();
        D_8018F590 = 0;
    } else {
        func_001A3490();
    }
    return ret;
}
