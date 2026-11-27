#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801951AC;
void D_80179018(void);
void D_80180BDC(void);
void func_000754a0(s32 k);
void func_00071b20(void) {
    if ((D_801951AC) != ((void *)0) && (*(s16 *)((u8 *)(D_801951AC) + (0))) > 0) { u32 sync = 0xE7000000; u32 cyc = 0xE3000A01; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (sync); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (sync); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (cyc); _g->second = (0x200000); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (sync); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001001); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3000C00); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001201); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFCFFFFFF); _g->second = (0xFFFCF279); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (sync); _g->second = (0); }; D_80179018(); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xD7000000); _g->second = (0x80008000); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (sync); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (sync); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (cyc); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (sync); _g->second = (0); }; func_000754a0(0); D_80180BDC(); } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };;
}
