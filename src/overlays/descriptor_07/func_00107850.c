#include "game/movement_queue_entry.h"
s32 func_00107850(MovementQueueEntry *t, s32 *root, s32 *free, s32 key, u32 val) {
    s32 i = *free;
    s32 n;
    s32 cur;
    s32 next;
    while (t[i].field04 != -1) {
        i++;
        i &= -(i < 0x1000);
    }
    n = i;
    if (t[*root].field04 == -1) {
        t[n].field04 = key;
        t[n].field08 = val;
        t[n].field00 = -1;
        t[n].field02 = -1;
        *free = n;
        *root = n;
        return 1;
    }
    t[n].field04 = key;
    t[n].field08 = val;
    t[n].field00 = -1;
    t[n].field02 = -1;
    *free = n;
    next = cur = *root;
    if (cur != -1) {
        do {
            cur = next;
            if (val < t[cur].field08) {
                next = t[cur].field00;
            } else if (val > t[cur].field08) {
                next = t[cur].field02;
            } else if (key < t[cur].field04) {
                next = t[cur].field00;
            } else if (key > t[cur].field04) {
                next = t[cur].field02;
            }
        } while (next != -1);
    }
    if (val < t[cur].field08) {
        t[cur].field00 = n;
    } else if (val > t[cur].field08) {
        t[cur].field02 = n;
    } else if (key < t[cur].field04) {
        t[cur].field00 = n;
    } else if (key > t[cur].field04) {
        t[cur].field02 = n;
    }
    return 1;
}
