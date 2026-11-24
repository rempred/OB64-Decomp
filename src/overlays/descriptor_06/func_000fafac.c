#include "game/boot_state_slot_callbacks.h"

typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
typedef struct {
    s16 h0;
    u8 unk02[2];
    s32 w4;
    u8 unk08[4];
    s32 wC;
    u8 unk10[0x74];
    s32 x84;
    u8 x88;
    u8 x89;
    u8 x8A;
    u8 x8B;
} Widget3390;
extern Widget3390 *D_801B3390;
typedef struct {
    u16 flags;
    u8 flags2;
    u8 flags3;
    u8 unk04[2];
    s16 x;
    s16 y;
    s16 x2;
    s16 y2;
    u16 hE;
    u8 unk10[4];
    BootStateSlotCallback update;
    BootStateSlotCallback draw;
    BootStateSlotCallback exit;
    u16 size;
    u8 unk22[2];
    s32 w24;
} CurSceneFA;
extern CurSceneFA D_800E7A30;
void func_000fafac(int slot);
void func_00008A74(s32 x, s32 y, s32 x2, s32 y2);
extern void boot_display_list_color_rect_packet_emit(u16, s16, s16, s16, s16);
void D_801768D4(s32 w, s32 h, s32 x, s32 y, s32 x2, s32 y2);
void D_80197B70(void);
void func_000fb104(f32 a, f32 b, s32 c, s32 d, s32 e);
void func_000FE5FC(Widget3390 *w);
void func_000fb5fc(void);
void func_000fbb6c(void);
void func_000fafac(int slot) {
    s32 i;
    u8 *e;
    func_00008A74(D_800E7A30.x, D_800E7A30.y, D_800E7A30.x2, D_800E7A30.y2);
    if (D_801B3390->unk10[0] != 0) {
        boot_display_list_color_rect_packet_emit(1, D_800E7A30.x, D_800E7A30.y, D_800E7A30.x2, D_800E7A30.y2);
        return;
    }
    D_801768D4(0x140, 0xF0, D_800E7A30.x, D_800E7A30.y, D_800E7A30.x2, D_800E7A30.y2);
    D_80197B70();
    for (i = 0; i < 4; i++) {
        e = (u8 *)D_801B3390 + i * 0x1C;
        if ((*(f32 *)((u8 *)(e) + (0x1C))) != 0.0f) {
            func_000fb104((*(f32 *)((u8 *)(e) + (0x1C))), (*(f32 *)((u8 *)(e) + (0x20))), (*(s32 *)((u8 *)(e) + (0x24))), (*(s32 *)((u8 *)(e) + (0x28))), (*(s32 *)((u8 *)(e) + (0x2C))));
        }
    }
    func_000FE5FC(D_801B3390);
    func_000fb5fc();
    func_000fbb6c();
}
void func_000fb5fc(void);
void func_000fbb6c(void);
