typedef signed int s32;
extern void *D_801F3620;
extern void *D_800C4BB8;
void bcopy(void *src, void *dst, s32 n);
void func_00134690(void) {
    bcopy(D_800C4BB8, D_801F3620, 0x25800);
}
