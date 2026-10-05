#include "common/types.h"

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
extern u16 D_800AEDE0;
extern u16 D_800AEDE2;
extern char D_800ADD00[];
extern char D_800ADD38[];
extern char D_800ADD70[];
extern void func_80093540(const char *, ...);
extern void func_80093380(void *, s32);
extern void func_00001DE8(ArenaNode **, ArenaNode *);

void resource_arena_register(u32 start, u32 size)
{
    u32 end = size;
    s32 i;
    ArenaNode **base_cursor;
    ArenaNode **end_cursor;
    u16 n;
    s32 slot;
    ArenaNode *end_pointer;
    s32 count;

    if (D_800AEDE0 >= 4) {
        func_80093540(D_800ADD00, start, size);
        for (;;) {}
    }
    end = (start + end) & -16;
    start = (start + 15) & -16;
    count = D_800AEDE0;
    i = 0;
    if (i < count) {
        end_cursor = &D_800AEDB0[0].end;
        base_cursor = end_cursor - 1;
        do {
            if ((start >= (u32)*base_cursor && start < (u32)*end_cursor) ||
                ((u32)*base_cursor < end && end <= (u32)*end_cursor)) {
                func_80093540(D_800ADD38, start, end);
                func_80093540(D_800ADD70, i, *base_cursor, *end_cursor);
                for (;;) {}
            }
            end_cursor += 3;
            ++i;
            base_cursor += 3;
        } while (i < D_800AEDE0);
    }
    D_800AEDB0[D_800AEDE0].base = (ArenaNode *)start;
    func_80093380((void *)start, 0x20);
    D_800AEDB0[D_800AEDE0].base->end = (ArenaNode *)end;
    D_800AEDB0[D_800AEDE0].base->bytes = end - start - 0x20;
    D_800AEDB0[D_800AEDE0].root = 0;
    func_00001DE8(&D_800AEDB0[D_800AEDE0].root,
                 D_800AEDB0[D_800AEDE0].base);
    n = D_800AEDE0;
    slot = n;
    n++;
    end_pointer = D_800AEDB0[slot].base->end;
    D_800AEDE0 = n;
    D_800AEDB0[slot].end = end_pointer;
}

void func_00001314(void)
{
    D_800AEDE0 = 1;
    D_800AEDE2 = 3;
}
