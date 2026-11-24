typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_80213778;
extern u8 *D_80213778;
typedef struct {
    u8 id;
    u8 flags;
    u8 rest[23];
} Sq151;
extern Sq151 g_func_001957D0_source_records[];
typedef struct {
    u8 unk0[0x15];
    u8 count;
    u8 unk16[2];
    u8 *members;
    u16 flags;
    u8 unk1E[6];
} Group151;
typedef struct {
    Group151 *g;
    u8 count;
    u8 start;
} GroupOut151;
typedef struct {
    u8 unk0;
    u8 id;
    u8 unk2[10];
} Ref151;
extern u8 *D_801F0CB0[];
typedef struct {
    u8 unk0[0x5D9];
    u8 idx[1];
} List151;
void func_00159BAC(u8 *a, s16 n);
u8 func_001591FC(Group151 *g, s32 n, GroupOut151 *out, Ref151 *r, s32 m) {
    u8 cnt = 0;
    u8 k = 0;
    s8 i;
    s8 j;
    s8 x;
    s8 start;
    u8 id;
    u8 c;
    for (i = 0; i < n; i++) {
        if (!(g[i].flags & 1)) {
            continue;
        }
        out[cnt].g = &g[i];
        out[cnt].count = g[i].count;
        out[cnt].start = k;
        start = k;
        for (j = 0; j < out[i].count; j++) {
            id = g[i].members[j];
            if (*(u32 *)D_801F0CB0[id] & 8) {
                c = g_func_001957D0_source_records[id].id | 0x80;
            } else {
                c = g_func_001957D0_source_records[id].id & 0x7F;
            }
            for (x = 0; x < m; x++) {
                if (r[x].id == c) {
                    break;
                }
            }
            if (x != m) {
                ((List151 *)D_80213778)->idx[k++] = x;
            }
        }
        out[cnt].count = k - start;
        cnt++;
        func_00159BAC(&D_80213778[0x5D9 + start], (u8)(k - start));
    }
    ((List151 *)D_80213778)->idx[k] = 0xFF;
    return cnt;
}
void func_00159BAC(u8 *a, s16 n);
