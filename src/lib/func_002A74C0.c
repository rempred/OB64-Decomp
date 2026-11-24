typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
void D_8020DFB8(void);
void D_8020DC80(u16 state);
extern f32 e09_byte_80220F68;
extern f32 e09_pointer_80220F6C;
extern f32 e09_u16_80220F70;
extern u8 D_80220EE0[];
extern u8 g_func_0015DF10_match[];
u8 *D_80214C84(s32 id, void (*fn)(u16, u8 *));
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
void D_8020D86C(u8 *o, s32 a, s32 b);
void D_801C5938(void *bank, s32 se);
extern f32 e09_pointer_80220F6C;
extern f32 e09_u16_80220F70;
extern u8 D_80220EE0[];
u8 *D_80214C84(s32 size, void (*fn)(u16, u8 *));
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
void D_8020D814(u8 *o);
void D_8020D86C(u8 *o, s32 a, s32 b);
void D_8020E0E4(u8 *o, s32 a, s32 b);
extern f32 e09_byte_80220F68;
extern u8 g_func_0015DF10_match[];
void func_002A7B3C(u16 msg, u8 *ctx);
void D_801C5938(void *bank, s32 se);
s32 func_002A74C0(u16 msg, u8 *ctx) {
    u8 *o;
    u8 *p;
    switch (msg) {
        case 0x101:
            if ((*(u8 * *)((u8 *)(ctx) + (0xC))) != ((void *)0)) {
                D_8020D814((*(u8 * *)((u8 *)(ctx) + (0xC))));
            }
            D_8020DFB8();
            break;
        case 0x100:
            (*(f32 *)((u8 *)(ctx) + (0))) = e09_byte_80220F68;
            (*(f32 *)((u8 *)(ctx) + (4))) = e09_pointer_80220F6C;
            (*(f32 *)((u8 *)(ctx) + (8))) = e09_u16_80220F70;
            (*(void * *)((u8 *)(ctx) + (0xC))) = ((void *)0);
            (*(s32 *)((u8 *)(ctx) + (0x10))) = 0;
            D_8020DC80(0x1000);
            break;
        case 0x1000:
            o = D_80214C84(0x1AA, func_002A7B3C);
            (*(u8 * *)((u8 *)(ctx) + (0xC))) = o;
            p = o + 0x1C;
            D_8020A4A8(D_80220EE0, p);
            D_8020A5A0(p, ctx);
            D_801C5938(g_func_0015DF10_match, 0x1F8);
            D_8020E0E4((*(u8 * *)((u8 *)(ctx) + (0xC))), 0x146, 0x1001);
            break;
        case 0x1001:
            (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(ctx) + (0xC)))) + (0xA))) |= 0x2000;
            D_8020DC80(0x1002);
        case 0x1002:
            if ((*(s32 *)((u8 *)(ctx) + (0x10))) != 0) {
                D_801C5938(g_func_0015DF10_match, 0x1F9);
                D_8020DC80(0x1004);
            }
            break;
        case 0x1003:
            (*(s32 *)((u8 *)(ctx) + (0x10))) = 1;
            break;
        case 0x1004:
            (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(ctx) + (0xC)))) + (0xA))) &= ~0x2000;
            D_8020D86C((*(u8 * *)((u8 *)(ctx) + (0xC))), 0x158, 0x166);
            D_8020DC80(0x1005);
            break;
    }
    return 0;
}
void func_002A7B3C(u16 msg, u8 *ctx);
