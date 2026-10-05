#include "game/resource_arena.h"

void resource_rebuild_free_trees(void)
{
    u16 mode = D_800AEDE2;
    s32 index = (mode >> 1) & 1;
    s32 iterations;
    ArenaNode **root_cursor;
    ArenaNode **end_cursor;
    ArenaNode *node;
    ArenaNode *root;
    ArenaNode **slot;

    if (index != 0) {
        iterations = D_800AEDE0 - ((~mode) & 1);
    } else {
        iterations = mode & 1;
    }
    index = 0;
    if (index < iterations) {
        root_cursor = &D_800AEDB0[0].root;
        end_cursor = root_cursor - 1;
        do {
            node = D_800AEDB0[index].base;
            D_800AEDB0[index].root = 0;
            while ((u32)node < (u32)*end_cursor) {
                if (node->available >= 0x21) {
                    root = *root_cursor;
                    if (root == 0) {
                        node->tree_slot = root_cursor;
                        node->left = 0;
                        node->right = 0;
                        *root_cursor = node;
                    } else {
                        if (root->available < node->available) {
                            slot = &root->right;
                        } else {
                            slot = &root->left;
                        }
                        func_00001DE8(slot, node);
                    }
                }
                node = node->next;
            }
            end_cursor += 3;
            ++index;
            root_cursor += 3;
        } while (index < iterations);
    }
}
