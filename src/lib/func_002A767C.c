typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
void D_8020DFB8(void);
void D_8020DC80(u16 state);
extern f32 e09_pointer_80220F6C;
extern f32 e09_u16_80220F70;
extern u8 D_80220EE0[];
u8 *D_80214C84(s32 id, void (*fn)(u16, u8 *));
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
void D_8020D86C(u8 *o, s32 a, s32 b);
void func_002A7C4C(u16 msg, u8 *ctx);
extern f32 e09_pointer_80220F6C;
extern f32 e09_u16_80220F70;
extern f32 e09_byte_80220F74;
extern u8 D_80220EE0[];
u8 *D_80214C84(s32 size, void (*fn)(u16, u8 *));
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
void D_8020D814(u8 *o);
void D_8020D86C(u8 *o, s32 a, s32 b);
void D_8020E0E4(u8 *o, s32 a, s32 b);
s32 func_002A767C(u16 msg, u8 *ctx) {
    u8 *o;
    u8 *p;
    switch (msg) {
        case 0x101:
            if ((*(u8 * *)((u8 *)(ctx) + (0x10))) != ((void *)0)) {
                D_8020D814((*(u8 * *)((u8 *)(ctx) + (0x10))));
            }
            D_8020DFB8();
            break;
        case 0x100:
            (*(f32 *)((u8 *)(ctx) + (0))) = e09_pointer_80220F6C;
            (*(f32 *)((u8 *)(ctx) + (4))) = e09_u16_80220F70;
            (*(f32 *)((u8 *)(ctx) + (8))) = e09_byte_80220F74;
            (*(void * *)((u8 *)(ctx) + (0x10))) = ((void *)0);
            (*(s32 *)((u8 *)(ctx) + (0xC))) = 0;
            D_8020DC80(0x1000);
            break;
        case 0x1000:
            o = D_80214C84(0x1AC, func_002A7C4C);
            (*(u8 * *)((u8 *)(ctx) + (0x10))) = o;
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x1000;
            (*(s32 *)((u8 *)((*(u8 * *)((u8 *)(ctx) + (0x10)))) + (0xC))) = -30000;
            p = (*(u8 * *)((u8 *)(ctx) + (0x10))) + 0x1C;
            D_8020A4A8(D_80220EE0, p);
            D_8020A5A0(p, ctx);
            D_8020E0E4((*(u8 * *)((u8 *)(ctx) + (0x10))), 0x1A, 0x1002);
            break;
        case 0x1002:
            (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(ctx) + (0x10)))) + (0xA))) |= 0x2000;
            D_8020DC80(0x1003);
        case 0x1003:
            if ((*(s32 *)((u8 *)(ctx) + (0xC))) != 0) {
                D_8020DC80(0x1005);
            }
            break;
        case 0x1004:
            (*(s32 *)((u8 *)(ctx) + (0xC))) = 1;
            break;
        case 0x1005:
            (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(ctx) + (0x10)))) + (0xA))) &= ~0x2000;
            D_8020D86C((*(u8 * *)((u8 *)(ctx) + (0x10))), 0x2C, 0x3A);
            D_8020DC80(0x1006);
            break;
    }
    return 0;
}
s32 func_002A767C(u16 msg, u8 *ctx);
void func_002A7C4C(u16 msg, u8 *ctx);
