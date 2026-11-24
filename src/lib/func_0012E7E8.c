#include "game/runtime_unit_source.h"
typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
typedef struct { u8 bytes[25]; } SourceRecord25;
typedef struct { u8 bytes[52]; } Record52;
typedef struct { u8 bytes[56]; } Record56;

extern SourceRecord25 g_func_001957D0_source_records[];
extern Record52 D_80195560[];
extern Record56 D_80193BC0[];

/* Return the first member with status bit 1 set, falling back to member slot zero. */
void *func_0012E7E8(void *unitView)
{
    RuntimeUnitSource *unit = unitView;
    s32 slot;
    u8 *source_bytes = g_func_001957D0_source_records[unit->source_index].bytes;
    /* Keep base + slot before the two-byte field displacement; folding the
       field into the row base reverses KMC address-add operands. */
    for (slot = 0; slot < 5; slot++) {
        u32 member_index = *(u8 *)((u32)source_bytes + slot + 2);
        u8 *character_bytes;
        if (member_index >= 100) {
            continue;
        }
        if (unit->source_index < 30) {
            character_bytes = D_80193BC0[member_index].bytes;
        } else {
            character_bytes = D_80195560[member_index].bytes;
        }
        if (character_bytes[0x33] & 2) {
            break;
        }
    }
    slot = slot < 5 ? slot : 0;
    if (unit->source_index >= 30) {
        return D_80195560[*(u8 *)((u32)source_bytes + slot + 2)].bytes;
    }
    return D_80193BC0[*(u8 *)((u32)source_bytes + slot + 2)].bytes;
}
