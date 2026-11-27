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
extern f32 D_801B81B4;
extern f32 D_801B81B8;
extern f32 D_801B81BC;
extern f32 D_801B81C0;
extern f32 D_801B81C4;
extern f32 D_801B81C8;
void guScale(Mtx1D4 *m, f32 x, f32 y, f32 z);
void func_001D7D84(void) {
    u16 perspNorm;
    func_000228d0(D_801969B0, &perspNorm, 12.88f, 4.0f / 3.0f, 1.0f, 4000.0f, 1.0f);
    func_000210c0(D_801969B0 + 1, D_801B81B4, D_801B81B8, D_801B81BC,
             D_801B81C0, D_801B81C4, D_801B81C8, 0.0f, 1.0f, 0.0f);
    guScale(D_801969B0 + 2, 0.1f, 0.1f, 0.1f);
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xDB0E0000;
        _g->second = perspNorm;
    }
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
