typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    s16 l;
    s16 r;
    s16 key;
    u32 val;
} Node1078;
s32 func_00107850(Node1078 *t, s32 *root, s32 *free, s32 key, u32 val) {
    s32 i = *free;
    s32 n;
    s32 cur;
    s32 next;
    while (t[i].key != -1) {
        i++;
        i &= -(i < 0x1000);
    }
    n = i;
    if (t[*root].key == -1) {
        t[n].key = key;
        t[n].val = val;
        t[n].l = -1;
        t[n].r = -1;
        *free = n;
        *root = n;
        return 1;
    }
    t[n].key = key;
    t[n].val = val;
    t[n].l = -1;
    t[n].r = -1;
    *free = n;
    next = cur = *root;
    if (cur != -1) {
        do {
            cur = next;
            if (val < t[cur].val) {
                next = t[cur].l;
            } else if (val > t[cur].val) {
                next = t[cur].r;
            } else if (key < t[cur].key) {
                next = t[cur].l;
            } else if (key > t[cur].key) {
                next = t[cur].r;
            }
        } while (next != -1);
    }
    if (val < t[cur].val) {
        t[cur].l = n;
    } else if (val > t[cur].val) {
        t[cur].r = n;
    } else if (key < t[cur].key) {
        t[cur].l = n;
    } else if (key > t[cur].key) {
        t[cur].r = n;
    }
    return 1;
}
