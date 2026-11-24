#include "game/boot_state_slot_callbacks.h"

typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
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
extern s32 D_800E79A0;
void boot_state_slot_queue_f000_record_step(void);
void func_00008388(s32 i);
void boot_state_slot_queue_f000_record_step(void) {
    s32 i;
    s32 s;
    s32 dx;
    s32 dy;
    for (i = 0; i < g_boot_state_slot_queue_service_gate; i++) {
        s = ((u16 *)D_800C4C10)[i];
        if ((g_state_slot_records[s].flags & 0xF000) != 0xF000) {
            continue;
        }
        if (g_state_slot_records[s].flags3 & 2) {
            continue;
        }
        if (g_state_slot_records[s].x2 == g_state_slot_records[s].x + D_800E79A0 - 1
            && g_state_slot_records[s].y2 == g_state_slot_records[s].y + D_800E79A0 - 1) {
            func_00008388(s);
            continue;
        }
        if (!(g_state_slot_records[s].flags & 0x400)) {
            dx = ((g_state_slot_records[s].x2 - g_state_slot_records[s].x + 1) << 8) / g_state_slot_records[s].unk04[0];
            dy = ((g_state_slot_records[s].y2 - g_state_slot_records[s].y + 1) << 8) / g_state_slot_records[s].unk04[0];
            g_state_slot_records[s].unk2E = 0;
            g_state_slot_records[s].flags |= 0x400;
            g_state_slot_records[s].unk28 = dx >> 8;
            g_state_slot_records[s].unk2A = dy >> 8;
            g_state_slot_records[s].unk2C = ((u8)dy << 8) | (u8)dx;
        }
        dx = (g_state_slot_records[s].unk28 << 8) | (g_state_slot_records[s].unk2C & 0xFF);
        dy = (g_state_slot_records[s].unk2A << 8) | (g_state_slot_records[s].unk2C >> 8);
        {
            s32 nx = ((g_state_slot_records[s].x2 << 8) | (g_state_slot_records[s].unk2E & 0xFF)) - dx;
            s32 ny = ((g_state_slot_records[s].y2 << 8) | (g_state_slot_records[s].unk2E >> 8)) - dy;
            g_state_slot_records[s].x2 = nx >> 8;
            g_state_slot_records[s].y2 = ny >> 8;
            g_state_slot_records[s].unk2E = (nx & 0xFF) | ((ny & 0xFF) << 8);
        }
        if (g_state_slot_records[s].x2 < g_state_slot_records[s].x + D_800E79A0 - 1) {
            g_state_slot_records[s].x2 = g_state_slot_records[s].x + D_800E79A0 - 1;
        }
        if (g_state_slot_records[s].y2 < g_state_slot_records[s].y + D_800E79A0 - 1) {
            g_state_slot_records[s].y2 = g_state_slot_records[s].y + D_800E79A0 - 1;
        }
    }
}
