#include "common/types.h"

typedef struct {
    u32 field_00;
    u32 field_04;
    u32 field_08;
    u32 field_0C;
    u32 field_10;
    u32 field_14;
    u32 field_18;
    u32 field_1C;
    u32 field_20;
    u32 field_24;
} S1Descriptor;

extern S1Descriptor D_800A83C0[];
extern u8 *D_800A86FC[];
extern u8 D_80243DB0[];
extern void func_000204C0(u32 start, u32 bytes);
extern void func_00020410(u32 start, u32 bytes);
extern void func_0002DE50(u32 source, u32 destination, u32 bytes);
extern void func_00023780(u32 start, u32 bytes);
extern void func_00001120(u32 start, u32 bytes);
u32 func_00006830(u32 mask);

void boot_resource_table_mask_apply(u32 mask)
{
    u8 group;
    u8 i;
    u8 id;

    group = func_00006830(mask);
    for (i = 0; D_800A86FC[group][i] != 0xFF; i++) {
        id = D_800A86FC[group][i];
        if (mask & (1 << id)) {
            func_000204C0(D_800A83C0[id].field_18,
                         D_800A83C0[id].field_1C - D_800A83C0[id].field_18);
            func_00020410(D_800A83C0[id].field_20,
                         D_800A83C0[id].field_24 - D_800A83C0[id].field_20);
            func_0002DE50(D_800A83C0[id].field_08, D_800A83C0[id].field_00,
                         D_800A83C0[id].field_0C - D_800A83C0[id].field_08);
            func_00023780(D_800A83C0[id].field_10,
                         D_800A83C0[id].field_14 - D_800A83C0[id].field_10);
        }
    }
}

void func_00006724(u32 mask)
{
    u8 group;
    u8 i;
    u8 id;
    u32 current;

    group = func_00006830(mask);
    current = D_800A83C0[0].field_00;
    for (i = 0; (id = D_800A86FC[group][i]) != 0xFF; i++) {
        if (mask & (1 << id)) {
            if (current < D_800A83C0[id].field_00) {
                func_00001120(current, D_800A83C0[id].field_00 - current);
            }
            current = D_800A83C0[id].field_04;
        }
    }
    if (current < (u32)D_80243DB0) {
        func_00001120(current, (u32)D_80243DB0 - current);
    }
}

u32 func_00006830(u32 mask)
{
    u32 group;
    u32 i;
    u32 group_mask;

    mask &= 0x3FFFFFFF;
    for (group = 0; D_800A86FC[group] != 0; group++) {
        i = 0;
        group_mask = 0;
        for (; D_800A86FC[group][i] != 0xFF; i++) {
            group_mask |= 1 << D_800A86FC[group][i];
        }
        if ((mask & ~group_mask) == 0) {
            return group;
        }
    }
    return 0;
}
