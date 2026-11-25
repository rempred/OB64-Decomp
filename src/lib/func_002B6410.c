typedef unsigned char u8;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 *D_8022A974;
void func_002B3D9C(void);
void func_002B47D0(void);
void func_002B6410(void) {
    s32 *p = (*(s32 * *)((u8 *)(D_8022A974) + (0x1A44)));
    if (p != ((void *)0)) {
        if (((u8 *)p)[0x14] == 0) {
            if (p[0] > p[1]) {
                return;
            }
            if (p[0] == p[1]) {
                func_002B3D9C();
            }
            p[0]++;
        } else {
            if (p[0] == 0) {
                func_002B47D0();
                func_000016C4(p);
                (*(s32 * *)((u8 *)(D_8022A974) + (0x1A44))) = ((void *)0);
                return;
            }
            p[0]--;
        }
    }
}
