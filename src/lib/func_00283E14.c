#include "game/resource_arena.h"

extern u32 func_0002def4(u32);
extern void *func_0002dfb8(void *, unsigned int);
extern void *resource_free(void *);
extern u32 func_8007A7E0(const u8 *source);
extern u32 boot_lzss_decompress(u8 *destination, const u8 *source);

s32 func_00283E14(s32 index)
{
    s32 *table;
    s32 resource;
    s32 decoded_size;
    s32 *decoded;
    s32 tag;
    s32 adjusted_size;

    table = resource_alloc_tree_scan(func_0002def4(0x019A8804));
    func_0002dfb8(table, 0x019A8804);
    resource = table[index];
    resource_free(table);

    table = resource_alloc_tree_scan(func_0002def4(resource));
    func_0002dfb8(table, resource);
    decoded_size = (s32)func_8007A7E0((const u8 *)table);
    decoded = resource_alloc_tree_scan(decoded_size);
    boot_lzss_decompress((u8 *)decoded, (const u8 *)table);

    if (decoded_size >= 0) {
        adjusted_size = decoded_size;
    } else {
        adjusted_size = decoded_size + 3;
    }
    tag = decoded[(adjusted_size >> 2) - 1];
    resource_free(table);
    resource_free(decoded);

    if ((tag & 0xFF000000) != 0xFF000000) {
        return 0;
    }

    switch (tag & 0xFF) {
    case 1:
        *(s8 *)0x801976DA = 0x18;
        return -3;
    case 2:
        return -6;
    case 3:
        *(s8 *)0x801976DA = 0x18;
        return -5;
    case 4:
        *(s8 *)0x801976DA = 0x18;
        return -4;
    case 5:
        *(s8 *)0x801976DA = 0x18;
        return -7;
    case 6:
        *(s8 *)0x801976DA = 0x18;
        return -8;
    case 7:
        return -9;
    case 8:
        return -10;
    }
    return 0;
}
