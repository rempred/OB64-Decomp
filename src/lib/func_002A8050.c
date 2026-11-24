typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
extern u8 D_801CFC70;
extern f32 e09_byte_80220F68;
extern f32 e09_pointer_80220F6C;
extern f32 e09_u16_80220F70;
extern u8 D_80220EE0[];
extern u8 g_func_0015DF10_match[];
extern u8 g_func_0015DF10_default[];
void D_8020DFB8(void);
void D_8020DC80(u16 state);
void D_8020E0B4(s32 a, s32 b);
u8 *D_80214BE8(s32 id);
u8 *D_80216018(s32 id);
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
void D_801C5938(void *bank, s32 se);
s32 func_002A8050(u16 msg, u8 *ctx) {
    switch (msg) {
        case 0x101:
            D_801CFC70 = 0;
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
            o = D_80216018(0x1B5);
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            o = D_80216018(0x1B6);
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            o = D_80216018(0x1B7);
            (*(s32 *)((u8 *)(o) + (0xC))) = -1000;
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x9000;
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            D_801C5938(g_func_0015DF10_match, 0x201);
            D_8020E0B4(0x2C, 0x1001);
            break;
        }
        case 0x1001: {
            u8 *o = D_80214BE8(0x1B4);
            u8 *p;
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            p = o + 0x1C;
            D_8020A4A8(D_80220EE0, p);
            D_8020A5A0(p, ctx);
            D_8020E0B4(0xC, 0x1002);
            break;
        }
        case 0x1002: {
            u8 *o = D_80216018(0x1B3);
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            D_8020E0B4(5, 0x1003);
            break;
        }
        case 0x1003: {
            u8 *o = D_80216018(0x1B2);
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            D_8020E0B4(0x4B, 0x1004);
            break;
        }
        case 0x1004:
            D_801C5938(g_func_0015DF10_default, 0x202);
            D_8020E0B4(0xF, 0x101);
            break;
    }
    return 0;
}
