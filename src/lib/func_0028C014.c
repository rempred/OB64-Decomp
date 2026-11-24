typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 D_8023DF18[];
extern u8 D_8023E5D0[];
extern u8 *D_8023DE30;
extern u8 D_8023E5A0[];
void bzero(void *p, s32 n);
void bzero(void *p, s32 n);
void bzero(void *p, s32 n);
extern inline u8 Lookup28(u8 id) {
    s16 i;
    u8 v;
    for (i = 0; D_8023DF18[i] != 0xFF; i++) {
        if (D_8023DF18[i] == id) {
            v = D_8023E5D0[i];
            if (v == 0) {
                return 0;
            }
            return D_8023E5A0[i] + (u8)(v - 1);
        }
    }
    return 0;
}
void func_0028C014(void) {
    u8 gone[50];
    u8 *m;
    s32 i;
    s32 j;
    s32 k;
    u16 r;
    bzero(gone, 50);
    for (i = 0; i < 50; i++) {
        m = ((u8 **)D_8023DE30)[i];
        if (m != ((void *)0) && Lookup28(m[0x2D]) == 0) {
            gone[i] = (*(u16 *)((u8 *)(m) + (0x2C)));
        }
    }
    for (i = 0; i < 50; i++) {
        m = ((u8 **)D_8023DE30)[i];
        if (m == ((void *)0)) {
            continue;
        }
        for (j = 0; j < m[7]; j++) {
            if (gone[i]) {
                func_000016C4(((void **)D_8023DE30)[m[8 + j] + 50]);
                ((void **)D_8023DE30)[m[8 + j] + 50] = ((void *)0);
            }
            r = (*(u16 *)((u8 *)(m) + (0x14 + j * 2)));
            if (r & 0xFF) {
                u8 t = r;
                for (k = 0; k < 50; k++) {
                    if (gone[k] == t) {
                        func_000016C4(((void **)D_8023DE30)[m[8 + j] + 50]);
                        ((void **)D_8023DE30)[m[8 + j] + 50] = ((void *)0);
                    }
                }
            }
        }
        if (gone[i]) {
            func_000016C4(((void **)D_8023DE30)[i]);
            ((void **)D_8023DE30)[i] = ((void *)0);
        }
    }
}
