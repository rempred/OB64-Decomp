typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void *func_00001330(s32 size);
typedef struct Task27 {
    u8 unk00[4];
    u16 state;
    u16 next;
    void (*fn)(s32, struct Task27 *);
    s16 hC;
    s16 hE;
    s16 h10;
    u8 unk12[0x26];
} Task27;
extern void *D_8022C890;
extern Task27 *D_8022D148;
extern s16 D_8022D0F2;
void func_0027CD40(void) {
    Task27 *p;
    s32 i;
    D_8022D0F2 = 5;
    D_8022C890 = func_00001330(0x118);
    D_8022D148 = D_8022C890;
    for (i = 0; i < D_8022D0F2; i++) {
        D_8022D148[i].fn = ((void *)0);
    }
    p = D_8022D148;
    for (i = 1; i < D_8022D0F2; i++) {
        p->next = i;
        p++;
    }
    p->next = 0xFFFF;
}
