#include "game/class_sprite.h"

typedef struct {
    void *base;
    u16 *pixels;
} ScriptSpriteSlots;

void func_001C0FC8(u8 *p, s32 a, s32 b, s32 c) {
    ScriptSpriteSlots *sprite = (ScriptSpriteSlots *)(p + 0x4C);

    p[0xF] |= c;
    sprite->base = D_8016FBE0(a, b, &sprite->pixels);
    (*(u16 *)((u8 *)(p) + (0x46))) = 2;
    (*(u16 *)((u8 *)(p) + (0x14))) = 2;
    (*(u16 *)((u8 *)(p) + (0x48))) = 2;
    (*(u16 *)((u8 *)(p) + (0x20))) = (*(u16 *)((u8 *)(p) + (0x46))) + 0x2C;
}
