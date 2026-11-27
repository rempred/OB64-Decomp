#include "game/combat_draw_commands.h"
void boot_display_list_flagged_rect_packet_emit(short x0, short y0, short x1, short y1);
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void D_80179018(void);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern s16 D_800E7A36;
extern s16 D_800E7A38;
extern s16 D_800E7A3A;
extern s16 D_800E7A3C;
extern u8 D_8018F480;
extern Gfx D_80186BD0[];
extern Gfx D_80186D90[];
u32 func_0000ABE0(const u8 *);
void func_0016DCE4(void);
void func_0016DACC(void);
void func_0016DACC(void) {
    CombatDrawCommand *g;
    boot_display_list_flagged_rect_packet_emit(D_800E7A36, D_800E7A38, D_800E7A3A, D_800E7A3C);
    D_80179018();
    D_8018F480 = 0;
    g = D_800E9BA0++;
    g->first = 0xDE000000;
    g->second = (u32)D_80186BD0;
    func_0016DCE4();
    g = D_800E9BA0++;
    g->first = 0xDE000000;
    g->second = (u32)D_80186D90;
}
