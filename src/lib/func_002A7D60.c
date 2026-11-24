typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
extern f32 e09_byte_80220F68;
extern f32 e09_pointer_80220F6C;
extern f32 e09_u16_80220F70;
extern u8 D_80220EE0[];
extern u8 g_func_0015DF10_match[];
void func_002A7F3C(u16 msg, u8 *ctx);
void D_8020DFB8(void);
void D_8020DC80(u16 state);
void D_8020E0B4(s32 a, s32 b);
u8 *D_80214BE8(s32 id);
u8 *D_80214C84(s32 id, void (*fn)(u16, u8 *));
u8 *D_80216018(s32 id);
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
void D_801C5938(void *bank, s32 se);
s32 func_002A7D60(u16 msg, u8 *ctx) {
    switch (msg) {
        case 0x101:
            D_8020DFB8();
            break;
        case 0x100:
            (*(f32 *)((u8 *)(ctx) + (0))) = e09_byte_80220F68;
            (*(f32 *)((u8 *)(ctx) + (4))) = e09_pointer_80220F6C;
            (*(f32 *)((u8 *)(ctx) + (8))) = e09_u16_80220F70;
            D_8020DC80(0x1000);
            break;
        case 0x1000: {
            u8 *o;
            u8 *p;
            o = D_80214BE8(0x1AF);
            p = o + 0x1C;
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            D_8020A4A8(D_80220EE0, p);
            D_8020A5A0(p, ctx);
            o = D_80214C84(0x1B1, func_002A7F3C);
            p = o + 0x1C;
            (*(s32 *)((u8 *)(o) + (0xC))) = -1000;
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x9000;
            D_8020A4A8(D_80220EE0, p);
            D_8020A5A0(p, ctx);
            D_801C5938(g_func_0015DF10_match, 0x200);
            D_8020E0B4(0x11, 0x1001);
            break;
        }
        case 0x1001: {
            u8 *o = D_80216018(0x1AE);
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            D_8020E0B4(3, 0x1002);
            break;
        }
        case 0x1002: {
            u8 *o = D_80214BE8(0x1B0);
            u8 *p = o + 0x1C;
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            D_8020A4A8(D_80220EE0, p);
            D_8020A5A0(p, ctx);
            D_8020E0B4(0x3C, 0x101);
            break;
        }
    }
    return 0;
}
void func_002A7F3C(u16 msg, u8 *ctx);
