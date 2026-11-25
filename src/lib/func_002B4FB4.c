typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
void *func_000016C4(void *ptr);
extern u8 *D_8022A974;
void func_002B3FE4(void);
typedef struct {
    f32 dx;
    f32 dy;
    s32 n;
    s32 i;
} Move2AE;
void func_002B3FE4(void);
void func_002B4FB4(void) {
    Move2AE *m;
    u8 *o;
    if ((*(Move2AE * *)((u8 *)(D_8022A974) + (0x1A4C))) != ((void *)0)) {
        func_002B3FE4();
        m = (*(Move2AE * *)((u8 *)(D_8022A974) + (0x1A4C)));
        if (m->i == m->n) {
            func_000016C4(m);
            (*(Move2AE * *)((u8 *)(D_8022A974) + (0x1A4C))) = ((void *)0);
        } else {
            m->i++;
            (*(f32 *)((u8 *)((*(u8 * *)((u8 *)(D_8022A974) + (0x1C58)))) + (0x40))) += m->dx;
            (*(f32 *)((u8 *)((*(u8 * *)((u8 *)(D_8022A974) + (0x1C58)))) + (0x44))) += m->dy;
        }
    }
}
