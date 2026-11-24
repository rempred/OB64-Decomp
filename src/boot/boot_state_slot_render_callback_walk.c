#include "game/boot_state_slot_callbacks.h"

#include "game/boot_slot_payload.h"
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
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
    BootStateSlotCallback update;
    BootStateSlotCallback draw;
    BootStateSlotCallback exit;
    u16 size;
    u8 unk22[2];
    u8 *data;
    s16 unk28;
    s16 unk2A;
    u16 unk2C;
    u16 unk2E;
    u8 unk30[8];
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
    void *unk98;
    u8 unk9C[4];
    u8 unkA0;
    u8 unkA1;
    s16 parent;
    u8 unkA4[4];
} Scene;
extern Scene g_state_slot_records[];
extern u16 g_boot_state_slot_queue_service_gate;
extern u8 D_800C4C10[];
void bcopy(const void *src, void *dst, s32 n);
extern s32 D_800C4C20;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern Scene D_800E7A30;
extern u8 D_800E91D0[];
extern u32 D_801869C8[];
void D_80173D84(void *list);
void D_80173DBC(s32 kind, s16 x, s16 y, s16 x2, s16 y2);
void boot_state_slot_payload_alloc_copy(u8 kind, void *src, u16 n, u8 **out);
void boot_state_slot_render_noop_tail(s32 color, s32 shade, s32 x, s32 y, s32 x2, s32 y2);
void boot_state_slot_render_callback_walk(void) {
    s32 i;
    s32 s;
    for (i = g_boot_state_slot_queue_service_gate - 1; i >= 0; i--) {
        s = ((u16 *)D_800C4C10)[i];
        D_800C4C20 = s;
        if (!(g_state_slot_records[s].flags & 0x2000) && g_state_slot_records[s].draw == ((void *)0)) {
            continue;
        }
        bcopy(&g_state_slot_records[s], &D_800E7A30, 0xA8);
        if (i == 0) {
            D_800E7A30.flags2 |= 4;
        }
        func_00008564((BootStateSlotPayload *)D_800E7A30.data, D_800E91D0);
        if (D_800E7A30.flags3 & 2) {
            Gfx *g = gTitleCardDisplayListCursor;
            g->w0 = 0xDE000000;
            g->w1 = (u32)D_801869C8;
            gTitleCardDisplayListCursor = g + 1;
            D_80173D84(D_800E7A30.unk98);
        } else if (!(D_800E7A30.flags2 & 1) && D_800E7A30.unkA0 != 0) {
            Gfx *g = gTitleCardDisplayListCursor;
            g->w0 = 0xDE000000;
            g->w1 = (u32)D_801869C8;
            gTitleCardDisplayListCursor = g + 1;
            D_80173DBC(D_800E7A30.unkA0, D_800E7A30.x, D_800E7A30.y, D_800E7A30.x2, D_800E7A30.y2);
        }
        {
            Gfx *g = gTitleCardDisplayListCursor;
            g->w0 = 0xDE000000;
            g->w1 = (u32)D_801869C8;
            gTitleCardDisplayListCursor = g + 1;
        }
        D_800E7A30.draw(s);
        {
            Gfx *g = gTitleCardDisplayListCursor;
            g->w0 = 0xE7000000;
            g->w1 = 0;
            gTitleCardDisplayListCursor = g + 1;
        }
        if (!(D_800E7A30.flags2 & 1) && D_800E7A30.unkA0 == 0) {
            if (i == 0) {
                boot_state_slot_render_noop_tail(0xFFFF, 0x18C1, D_800E7A30.x, D_800E7A30.y, D_800E7A30.x2, D_800E7A30.y2);
            } else {
                boot_state_slot_render_noop_tail(0x4211, 0x843, D_800E7A30.x, D_800E7A30.y, D_800E7A30.x2, D_800E7A30.y2);
            }
        }
        if (i == 0) {
            D_800E7A30.flags2 &= ~4;
        }
        boot_state_slot_payload_alloc_copy(D_800E7A30.flags, D_800E91D0, D_800E7A30.size, &D_800E7A30.data);
        bcopy(&D_800E7A30, &g_state_slot_records[s], 0xA8);
    }
    D_800C4C20 = -1;
}
void boot_state_slot_payload_alloc_copy(u8 kind, void *src, u16 n, u8 **out);
void boot_state_slot_render_noop_tail(s32 color, s32 shade, s32 x, s32 y, s32 x2, s32 y2);
