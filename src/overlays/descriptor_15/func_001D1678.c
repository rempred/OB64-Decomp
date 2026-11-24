typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern void *D_801BA6F8;
typedef struct {
    s32 id;
    u8 unk04[4];
    void *p08;
    u8 unk0C[0xC];
    u32 count;
    u8 unk1C[0xC];
    void *p28;
    u8 unk2C[8];
    void **parts;
    void *p38;
    void *p3C;
    u8 unk40[0x18];
    void *p58;
} Ent1CE;
extern u8 D_801B8098[];
u8 func_001D1678(s32 id, s32 anim, u32 n, u8 *p1, u8 *p2, u8 *p3) {
    Ent1CE *e = D_801BA6F8;
    s32 k = 9;
    u8 *tab;
    u8 *c;
    u32 count;
    u32 i;
    do {
        if (e->id != 0 && e->id == id) {
            tab = e->p38;
            goto found;
        }
        e++;
    } while (k--);
    tab = ((void *)0);
found:
    if (tab != ((void *)0)) {
        c = (u8 *)(((s32 *)tab)[anim] + (s32)tab);
    } else {
        c = ((void *)0);
    }
    count = *c++;
    for (i = 0; i < count; i++) {
        if (i == n) {
            switch (D_801B8098[c[0]]) {
                case 2:
                    if (p1 != ((void *)0)) {
                        *p1 = c[1];
                    }
                    break;
                case 3:
                    if (p1 != ((void *)0)) {
                        *p1 = c[1];
                    }
                    if (p2 != ((void *)0)) {
                        *p2 = c[2];
                    }
                    break;
                case 4:
                    if (p1 != ((void *)0)) {
                        *p1 = c[1];
                    }
                    if (p2 != ((void *)0)) {
                        *p2 = c[2];
                    }
                    if (p3 != ((void *)0)) {
                        *p3 = c[3];
                    }
                    break;
            }
            return c[0];
        }
        c += D_801B8098[c[0]];
    }
    return 0;
}
