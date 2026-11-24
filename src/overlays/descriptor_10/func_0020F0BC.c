typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void *func_00001330(s32 size);
extern void *D_801D0824;
typedef struct {
    u16 next;
    u16 a;
    u16 b;
    u8 unk06[2];
    s32 c;
    u8 unk0C[0x78];
} Node20B;
extern Node20B *D_801D0708;
extern s16 D_801D0714;
extern u16 D_801D0724;
extern u16 D_801D0818;
extern Node20B *D_801D081C;
extern s32 D_801D0834;
void func_0020F0BC(void) {
    Node20B *n;
    s32 i;
    D_801D0834 = 16;
    n = func_00001330(0x8E0);
    D_801D0824 = n;
    D_801D081C = n;
    D_801D0708 = n + D_801D0834;
    for (i = 0; i < D_801D0834; i++) {
        n[i].c = 0;
        n[i].b = 0xFFFF;
        n[i].a = 0xFFFF;
    }
    for (i = 0; i < D_801D0834 - 1; i++) {
        D_801D081C[i].next = i + 1;
    }
    D_801D081C[i].next = 0xFFFF;
    bzero(D_801D0708, 0xA0);
    D_801D0714 = 0;
    D_801D0818 = 0xFFFF;
    D_801D0724 = 0xFFFF;
}
