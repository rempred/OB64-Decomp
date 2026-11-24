typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
void D_8020DFB8(void);
void D_8020DC80(u16 state);
void D_8020E0B4(s32 a, s32 b);
extern f32 e09_byte_80220F68;
extern f32 e09_pointer_80220F6C;
extern f32 e09_u16_80220F70;
extern u8 D_80220EE0[];
extern u8 g_func_0015DF10_match[];
extern u8 g_func_0015DF10_default[];
u8 *D_80214BE8(s32 id);
u8 *D_80214C84(s32 id, void (*fn)(u16, u8 *));
u8 *D_80216018(s32 id);
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
void D_8020D86C(u8 *o, s32 a, s32 b);
void D_8020D884(u8 *o);
void D_801C5938(void *bank, s32 se);
void D_8020E0B4(s32 a, s32 b);
void func_002A73B4(u16 msg, u8 *ctx);
s32 func_002A7060(u16 msg, u8 *ctx) {
    switch (msg) {
        case 0x101:
            D_8020DFB8();
            break;
        case 0x100:
            (*(f32 *)((u8 *)(ctx) + (0))) = e09_byte_80220F68;
            (*(f32 *)((u8 *)(ctx) + (4))) = e09_pointer_80220F6C;
            (*(f32 *)((u8 *)(ctx) + (8))) = e09_u16_80220F70;
            (*(s32 *)((u8 *)(ctx) + (0xC))) = 0;
            D_8020DC80(0x1000);
            break;
        case 0x1000:
            D_8020A4A8(D_80220EE0, ctx + 0x10);
            D_8020A5A0(ctx + 0x10, ctx);
            D_801C5938(g_func_0015DF10_match, 0x1F2);
        case 0x1001:
            (*(u8 * *)((u8 *)(ctx) + (0x50))) = D_80214C84(0x1A8, func_002A73B4);
            (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(ctx) + (0x50)))) + (0xA))) |= 0x8000;
            D_8020D86C((*(u8 * *)((u8 *)(ctx) + (0x50))), 0x96, 0xAA);
            D_8020A4A8(ctx + 0x10, (*(u8 * *)((u8 *)(ctx) + (0x50))) + 0x1C);
            D_8020E0B4(4, 0x1002);
            break;
        case 0x1002: {
            u8 *o = D_80214BE8(0x1A9);
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            D_8020A4A8(ctx + 0x10, o + 0x1C);
            D_8020E0B4(0x49, 0x1003);
            break;
        }
        case 0x1003:
            (*(u8 * *)((u8 *)(ctx) + (0x54))) = D_80214BE8(0x1A6);
            (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(ctx) + (0x54)))) + (0xA))) |= 0x1000;
            D_8020D86C((*(u8 * *)((u8 *)(ctx) + (0x54))), 0x48, 0x5C);
            (*(s32 *)((u8 *)((*(u8 * *)((u8 *)(ctx) + (0x54)))) + (0xC))) = -10000;
            D_8020A4A8(ctx + 0x10, (*(u8 * *)((u8 *)(ctx) + (0x54))) + 0x1C);
            D_801C5938(g_func_0015DF10_default, 0x1F3);
            D_8020DC80(0x1004);
            break;
        case 0x1004:
            if ((*(s32 *)((u8 *)(ctx) + (0xC))) != 0) {
                D_8020D884((*(u8 * *)((u8 *)(ctx) + (0x50))));
                D_8020D884((*(u8 * *)((u8 *)(ctx) + (0x54))));
                D_8020DC80(0x1005);
            }
            break;
        case 0x1005:
            if ((*(s32 *)((u8 *)((*(u8 * *)((u8 *)(ctx) + (0x50)))) + (0x10))) >= 0xAA) {
                D_801C5938(g_func_0015DF10_default, 0x1F4);
                D_8020E0B4(0x8D, 0x1006);
            }
            break;
        case 0x1006: {
            u8 *o = D_80216018(0x1A4);
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            D_801C5938(g_func_0015DF10_default, 0x1F5);
            D_8020E0B4(0x1C, 0x1007);
            break;
        }
        case 0x1007: {
            u8 *o = D_80216018(0x1A7);
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            D_8020E0B4(0x1A, 0x1008);
            break;
        }
        case 0x1008: {
            u8 *o = D_80216018(0x1A5);
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            D_8020E0B4(0x3C, 0x101);
            break;
        }
        case 0x1009:
            (*(s32 *)((u8 *)(ctx) + (0xC))) = 1;
            break;
    }
    return 0;
}
void func_002A73B4(u16 msg, u8 *ctx);
extern f32 e09_pointer_80220F6C;
extern f32 e09_u16_80220F70;
extern u8 D_80220EE0[];
u8 *D_80214C84(s32 size, void (*fn)(u16, u8 *));
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
void D_8020D86C(u8 *o, s32 a, s32 b);
extern f32 e09_byte_80220F68;
extern u8 g_func_0015DF10_match[];
void D_801C5938(void *bank, s32 se);
u8 *D_80216018(s32 id);
