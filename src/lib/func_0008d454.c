#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern u8 *D_80196AF8;
typedef struct {
    u8 pad0[4];
    struct Ent87 {
        s16 x;
        s16 y;
        u8 f;
        u8 pad[5];
    } e[8];
    s32 n;
    s32 id;
} Slot87;
typedef struct {
    u8 pad0[0x1C];
    u8 *p1C;
    u8 pad20[0x2C - 0x20];
    u8 *p2C;
    u8 *p30;
    void *p34[2];
    u8 *p3C;
    void *p40[2];
    u8 pad48[8];
    u8 *p50;
    u8 *p54;
    u8 *p58;
    u8 pad5C[0x64 - 0x5C];
    u8 *p64;
    u8 pad68[0x78 - 0x68];
    s32 cur78;
    u8 pad7C[0x18C - 0x7C];
    u16 sq18C;
    u16 row18E;
    u8 pad190[0x198 - 0x190];
    u16 col198;
    u8 pad19A[0x19E - 0x19A];
    u16 col19E;
    u8 pad1A0[0x5E8 - 0x1A0];
    u16 cls5E8;
    u8 pad5EA[0x10A4 - 0x5EA];
    struct Mk87 {
        u8 pad0[4];
        u8 shown;
        u8 kind;
        u8 pad6[2];
        s32 x;
        s32 y;
    } mk[3];
    struct Row87 {
        u8 h[2];
        u8 sq[5];
        u8 entry;
        u8 pad8[2];
        u8 item;
        u8 padB[3];
    } rows[10];
    u8 pad1160[0x117C - 0x1160];
    struct Sq87 {
        u8 num;
        u8 flags;
        u8 row;
        u8 lead;
        u8 mem[0x1D - 4];
        u8 item;
        u8 name;
        u8 pad1F;
        u8 cnt;
        u8 pad21;
        u16 icon[10];
    } sq[1];
    u8 pad11B2[0x1AB8 - 0x11B2];
    Slot87 slot[2];
    u8 pad1B70[0x1BD0 - 0x1B70];
    s32 slotSel;
    s32 mode1BD4;
    u8 sel;
    u8 pad1BD9[0x1BF6 - 0x1BD9];
    u16 v1BF6;
    u8 pad1BF8[2];
    u16 v1BFA;
} Main87;
extern Gfx D_06004830[];
void func_00087200(void *a, s32 y, s32 k);
void func_0008d454(s32 x, s32 y, u8 a) {
    u16 f = a / (100.0f / 7.0f);
    if (f >= 7) {
        f = 6;
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3000C00); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_06004830); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xD7000002); _g->second = (0x80008000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFD500000); _g->second = ((u32)(((Main87 *)D_80196AF8)->p2C + f * 256)); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5500000); _g->second = (0x7000000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE6000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF3000000); _g->second = (0x707F400); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5400400); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF2000000); _g->second = (0x7C03C); };
    func_00087200((void *)x, y, 9);
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xD7000000); _g->second = (0x80008000); };
}
