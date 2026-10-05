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
extern u16 D_800AEDE0;
extern u16 D_800AEDE2;

u32 resource_largest_free_block(void)
{
    u16 mode = D_800AEDE2;
    s32 index = (mode >> 1) & 1;
    s32 iterations;
    s32 count;
    s32 scanned = 0;
    u32 largest = 0;
    ArenaNode *node;
    u32 available;

    if (index != 0) {
        count = D_800AEDE0;
        iterations = count - ((~mode) & 1);
        index &= -((u32)count >= 2);
    } else {
        iterations = mode & 1;
    }
    if (scanned < iterations) {
        count = D_800AEDE0;
        do {
            node = D_800AEDB0[index].root;
            while (node != 0) {
                available = node->available;
                if (largest < available) largest = available;
                node = node->right;
            }
            ++scanned;
            index = (index + 1) % count;
        } while (scanned < iterations);
    }
    return largest;
}
