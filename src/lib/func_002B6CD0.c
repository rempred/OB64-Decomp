typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 *D_8022A974;
s32 D_8022AF94(u8 id, s32 a, s32 b, s32 c, s32 d, s32 e, s32 f, s32 g, s32 h);
void func_002B6964(s32 slot, s32 sel, s32 src, s32 d, s32 e);
extern inline void func_002B68B4(s32 s) {
    s32 i;
    s32 end;
    if (s == -1) {
        s = 0;
        end = 20;
    } else {
        end = s + 1;
    }
    for (i = s; i < end; i++) {
        u8 *e = ((u8 **)(D_8022A974 + 0x1B38))[i];
        if (e != ((void *)0)) {
            func_000016C4((*(void * *)((u8 *)(e) + (0x68))));
            func_000016C4((*(void * *)((u8 *)(e) + (0x6C))));
            func_000016C4(e);
            ((u8 **)(D_8022A974 + 0x1B38))[i] = ((void *)0);
        }
    }
}
void func_002B6CD0(u8 id, s32 a, s32 b, s32 c, s32 d, s32 e, s32 h, s32 sel, s32 slot, s32 flag) {
    u8 *o;
    if (flag == -1) {
        D_8022AF94(id, a, b, 0, d, e, 1, 100, c);
    }
    o = (*(u8 * *)((u8 *)(D_8022A974 + id * 4) + (0x1AC0)));
    if (slot == -1) {
        (*(s16 *)((u8 *)(o) + (0x40))) = h;
        return;
    }
    if (sel == -1 && (*(u8 * *)((u8 *)(D_8022A974 + slot * 4) + (0x19F4))) != ((void *)0)) {
        (*(u16 *)((u8 *)(o) + (0x40))) = (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(D_8022A974 + slot * 4) + (0x19F4)))) + (0x74)));
        return;
    }
    func_002B6964(0x13, sel, slot, 100, -1);
    (*(u16 *)((u8 *)(o) + (0x40))) = (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(D_8022A974) + (0x1B84)))) + (8)));
    func_002B68B4(0x13);
}
