typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    f32 x;
    f32 y;
} Scale224;
extern Scale224 D_801E6438[];
typedef struct {
    s32 state;
    s32 a;
    s32 b;
    f32 sx;
    f32 sy;
    s32 state2;
    s32 a2;
    s32 b2;
    f32 sx2;
    f32 sy2;
    u32 k;
    u32 k2;
    u8 pad30[0x2A];
    s16 alpha;
} AnimFade224;
void func_00225CC0(u16 cmd, u8 *o, AnimFade224 *st) {
    switch (cmd) { case 0: bzero(st, sizeof(AnimFade224)); st->state = 0xD; st->a = 0; st->b = -4; st->sx = st->sy = 0.0f; st->state2 = 0xE; st->a2 = 0; st->b2 = 4; st->sx2 = st->sy2 = 0.0f; st->k2 = 0; st->k = 0; st->alpha = 0xFF; break; case 0x80: st->sx = D_801E6438[st->k].x; st->sy = D_801E6438[st->k].y; st->k++; if (st->k >= 10) { (*(u16 *)((u8 *)(o) + (0x20))) = 0x81; st->k2 = 0; st->k = 0; } break; case 0x81: st->sx2 = D_801E6438[st->k].x; st->sy2 = D_801E6438[st->k].y; st->k++; if (st->k >= 10) { (*(u16 *)((u8 *)(o) + (0x20))) = 0x82; st->k2 = 0; st->k = 0; } break; case 0x82: if ((s32)st->k++ >= 11) { (*(u16 *)((u8 *)(o) + (0x20))) = 0x83; st->k2 = 0; st->k = 0; } break; case 0x83: st->alpha = 0xFF - (s32)(st->k * 0xFF) / 10; if ((s32)++st->k >= 11) { (*(u16 *)((u8 *)(o) + (0x20))) = 1; } break; };
}
