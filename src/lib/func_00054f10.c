typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct Node {
    struct Node *prev;
    struct Node *next;
    u8 unk08[0xE];
    u16 id;
} Node;
Node *func_00051f74(u16 kind, u8 b, void (*fn)(), s16 x, s16 y, s16 w, s16 h);
void func_000566f4(Node *n, u32 a);
void func_00052484();
Node *func_00054f10(void *data, u16 kind, s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2) {
    Node *n = func_00051f74(kind | 0x100, 0, func_00052484, x, y, w, h);
    (*(s16 *)((u8 *)(n) + (0x18))) = 0;
    (*(s32 *)((u8 *)(n) + (0x3C))) = x2;
    (*(s32 *)((u8 *)(n) + (0x40))) = y2;
    (*(s32 *)((u8 *)(n) + (0x44))) = w2;
    (*(s32 *)((u8 *)(n) + (0x48))) = h2;
    (*(s16 *)((u8 *)(n) + (0x28))) = 1;
    (*(u16 *)((u8 *)(n) + (0x26))) = 0x8000;
    (*(void * *)((u8 *)(n) + (0xE0))) = data;
    func_000566f4(n, 0x52057);
    return n;
}
