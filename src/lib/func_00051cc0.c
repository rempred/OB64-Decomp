typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void *resource_alloc_mode1_wrapper(u32 size);
typedef struct Node {
    struct Node *prev;
    struct Node *next;
    u8 unk08[0xE];
    u16 id;
} Node;
extern Node *D_8018FDC0;
void guMtxIdent(void *m);
void *D_8009DE40(s32 id);
void func_000210c0(void *m, f32 xEye, f32 yEye, f32 zEye, f32 xAt, f32 yAt, f32 zAt, f32 xUp, f32 yUp, f32 zUp);
void func_000225d0(void *m, f32 l, f32 r, f32 b, f32 t, f32 n, f32 f, f32 scale);
void func_00051cc0(void) {
    Node *n;
    if (D_8018FDC0 == ((void *)0)) {
        n = resource_alloc_mode1_wrapper(0xD8);
        D_8018FDC0 = n;
        (*(s16 *)((u8 *)(n) + (0))) = 0;
        n->next = ((void *)0);
        (*(void * *)((u8 *)(D_8018FDC0) + (0xC8))) = D_8009DE40(0x01DFA632);
        (*(void * *)((u8 *)(D_8018FDC0) + (0xCC))) = D_8009DE40(0x01DFB536);
        func_000225d0((u8 *)D_8018FDC0 + 8, -160.0f, 160.0f, -120.0f, 120.0f, -10.0f, 100.0f, 1.0f);
        func_000210c0((u8 *)D_8018FDC0 + 0x48, 0.0f, 0.0f, -10.0f, 0.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f);
        guMtxIdent((u8 *)D_8018FDC0 + 0x88);
        (*(s16 *)((u8 *)(D_8018FDC0) + (0xD0))) = 0;
        (*(s8 *)((u8 *)(D_8018FDC0) + (0xD2))) = 0;
    }
}
