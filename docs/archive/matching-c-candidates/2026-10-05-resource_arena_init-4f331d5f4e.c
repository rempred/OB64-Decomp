#include "common/types.h"

/* Offset views only; the low-level list helpers remain external. */
typedef struct ArenaNode {
    u32 field00;
    struct ArenaNode *end;
    u32 field08;
    u32 field0C;
    struct ArenaNode *field10;
    u32 field14;
    u32 bytes;
    u32 field1C;
} ArenaNode;

typedef struct ArenaRecord {
    ArenaNode *base;
    ArenaNode *end;
    ArenaNode *root;
} ArenaRecord;

extern ArenaRecord D_800AEDB0[];
extern u32 D_800AEDB4;
extern u16 D_800AEDE0;
extern u16 D_800AEDE2;
extern u32 D_800C4818;
extern void func_80093380(void *, s32);
extern void func_00001DE8(ArenaNode **, ArenaNode *);

void resource_arena_init(u32 start, u32 size)
{
    u32 end = start + size;
    s32 mask = -16;
    ArenaRecord *arena = D_800AEDB0;
    start = (start + 15) & mask;
    end &= mask;
    arena->base = (ArenaNode *)start;
    func_80093380((void *)start, 0x20);
    D_800AEDB0[0].base->end = (ArenaNode *)end;
    D_800AEDB0[0].base->bytes = end - start - 0x20;
    arena->root = 0;
    func_00001DE8(&arena->root, arena->base);
    D_800C4818 = 0;
    D_800AEDE0 = 1;
    D_800AEDE2 = 3;
    D_800AEDB4 = (u32)D_800AEDB0[0].base->end;
}
