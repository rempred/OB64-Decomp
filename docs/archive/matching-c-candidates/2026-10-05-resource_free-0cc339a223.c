#include "common/types.h"

typedef struct ArenaNode {
    struct ArenaNode *prev;
    struct ArenaNode *next;
    struct ArenaNode **tree_slot;
    struct ArenaNode *left;
    struct ArenaNode *right;
    u32 used;
    u32 available;
    u32 field1C;
} ArenaNode;

typedef struct ArenaRecord {
    ArenaNode *base;
    ArenaNode *end;
    ArenaNode *root;
} ArenaRecord;

extern ArenaRecord D_800AEDB0[];
extern u32 D_800C4818;
extern s32 func_00001F9C(void *);
extern void func_00001D50(ArenaNode *);
extern void func_00001DE8(ArenaNode **, ArenaNode *);
extern void func_00001E74(void);

s32 resource_free(u8 *pointer)
{
    s32 index = func_00001F9C(pointer);
    ArenaNode *node;
    ArenaNode *header;
    u8 *used_end;

    if (pointer != 0) {
        header = (ArenaNode *)(pointer - 0x20);
        node = header;
        if (header->available >= 0x21) func_00001D50(node);
        header->prev->next = header->next;
        if ((u32)header->next < (u32)D_800AEDB0[index].end)
            header->next->prev = header->prev;
        node = header->prev;
        if (node->available >= 0x21) func_00001D50(node);
        used_end = (u8 *)node + (node->used + 0x20);
        node->available = (u32)node->next - (u32)used_end;
        if (node->available >= 0x21)
            func_00001DE8(&D_800AEDB0[index].root, node);
        header->next = 0;
        header->prev = 0;
        D_800C4818++;
        if (D_800C4818 > 0x3FFFF) {
            func_00001E74();
            D_800C4818 = 0;
        }
    }
    return 0;
}
