#include "game/combat_draw_commands.h"
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    s32 m[4][4];
} Mtx1D4;
extern Mtx1D4 *D_801969B0;
void func_000228d0(void *, unsigned short *, float, float, float, float, float);
void func_000210c0(void *, float, float, float, float, float, float, float, float, float);
void guMtxIdent(Mtx1D4 *m);
void func_001D573C(void) {
    u16 perspNorm;
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE7000000;
        _g->second = 0;
    }
    func_000228d0(D_801969B0, &perspNorm, 1.0f, 4.0f / 3.0f, 1.0f, 8000.0f, 1.0f);
    func_000210c0(D_801969B0 + 1, 0.0f, 2750.0f, 6759.0f, 0.0f, 16.3f, 0.0f, 0.0f, 1.0f, 0.0f);
    guMtxIdent(D_801969B0 + 2);
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xDA380007;
        _g->second = (u32)D_801969B0++;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xDA380005;
        _g->second = (u32)D_801969B0++;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xDA380003;
        _g->second = (u32)D_801969B0++;
    }
}
