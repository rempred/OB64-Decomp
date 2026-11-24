void bzero(void *p, int n);
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void *func_00001330(unsigned int);
void *func_000016C4(void *ptr);
void func_00023940(const char *, ...);
typedef struct {
    u8 unk0[3];
    u8 flags;
    s32 unk4;
    s32 unk8;
} Item151;
typedef struct {
    u8 unk0[8];
    u8 count;
    u8 members[7];
} Set151;
extern signed char D_80214D84[];
extern signed char D_80214D9C[];
void func_00023940(const char *, ...);
void *memcpy_00023884(void *dst, const void *src, u32 n);
void func_00159D54(Set151 *sets, s32 nsets, Item151 *items, s32 n) {
    Item151 *tmp;
    s32 *used;
    u8 out;
    u8 i;
    u8 j;
    u8 k;
    tmp = func_00001330(n * sizeof(Item151));
    used = func_00001330(nsets * 4);
    bzero(used, nsets * 4);
    out = 0;
    for (i = 0; i < n; i++) {
        if (items[i].flags & 1) {
            continue;
        }
        if (items[i].flags & 0x80) {
            for (j = 0; j < nsets; j++) {
                if (used[j] == 0 && sets[j].members[0] == i) {
                    break;
                }
            }
            if (j >= nsets) {
                func_00023940(D_80214D84);
            }
            used[j] = 1;
            for (k = 0; k < sets[j].count; k++) {
                if (items[sets[j].members[k]].flags & 0x81) {
                    tmp[out] = items[sets[j].members[k]];
                    sets[j].members[k] = out++;
                } else {
                    func_00023940(D_80214D9C);
                }
            }
        } else {
            tmp[out++] = items[i];
        }
    }
    memcpy_00023884(items, tmp, out * sizeof(Item151));
    func_000016C4(used);
    func_000016C4(tmp);
}
