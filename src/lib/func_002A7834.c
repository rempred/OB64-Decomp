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
u8 *D_80216018(s32 id);
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
void D_801C5938(void *bank, s32 se);
void D_8020E0B4(s32 a, s32 b);
extern f32 e09_pointer_80220F6C;
extern f32 e09_u16_80220F70;
extern f32 e09_byte_80220F74;
extern u8 D_80220EE0[];
void D_8020A4A8(u8 *a, u8 *b);
void D_8020A5A0(u8 *a, u8 *b);
extern f32 e09_byte_80220F68;
extern u8 g_func_0015DF10_match[];
void D_801C5938(void *bank, s32 se);
s32 func_002A74C0(u16 msg, u8 *ctx);
s32 func_002A767C(u16 msg, u8 *ctx);
extern u8 D_801CFC70;
s32 D_8020DF00(s32 (*fn)(u16, u8 *));
void D_8020DCAC(s32 h, u16 msg);
u8 *D_802158AC(s32 id);
u8 *D_80216018(s32 id);
s32 func_002A767C(u16 msg, u8 *ctx);
s32 func_002A7A6C(u16 msg);
s32 func_002A7834(u16 msg, u8 *ctx) {
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
        case 0x1000:
            e09_byte_80220F68 = (*(f32 *)((u8 *)(ctx) + (0)));
            e09_pointer_80220F6C = (*(f32 *)((u8 *)(ctx) + (4)));
            e09_u16_80220F70 = (*(f32 *)((u8 *)(ctx) + (8)));
            (*(s32 *)((u8 *)(ctx) + (0xC))) = D_8020DF00(func_002A74C0);
            D_8020E0B4(0x105, 0x1003);
            break;
        case 0x1003: {
            u8 *o = D_802158AC(0x1AD);
            u8 *p;
            (*(s32 *)((u8 *)(o) + (0xC))) = 10000;
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x9000;
            p = o + 0x1C;
            D_8020A4A8(D_80220EE0, p);
            D_8020A5A0(p, ctx);
            D_8020DF00((s32 (*)(u16, u8 *))func_002A7A6C);
            D_801C5938(g_func_0015DF10_match, 0x1F9);
            D_8020E0B4(0x10, 0x1001);
            break;
        }
        case 0x1001: {
            u8 *o = D_80216018(0x1AB);
            (*(u16 *)((u8 *)(o) + (0xA))) |= 0x8000;
            (*(f32 *)((u8 *)(o) + (0x1C))) = (*(f32 *)((u8 *)(ctx) + (0)));
            (*(f32 *)((u8 *)(o) + (0x20))) = (*(f32 *)((u8 *)(ctx) + (4)));
            (*(f32 *)((u8 *)(o) + (0x24))) = (*(f32 *)((u8 *)(ctx) + (8)));
            D_8020E0B4(0x16, 0x1002);
            break;
        }
        case 0x1002:
            e09_pointer_80220F6C = (*(f32 *)((u8 *)(ctx) + (0)));
            e09_u16_80220F70 = (*(f32 *)((u8 *)(ctx) + (4)));
            e09_byte_80220F74 = (*(f32 *)((u8 *)(ctx) + (8)));
            (*(s32 *)((u8 *)(ctx) + (0x10))) = D_8020DF00(func_002A767C);
            D_8020DC80(0x1004);
            break;
        case 0x1005:
            D_8020DCAC((*(s32 *)((u8 *)(ctx) + (0xC))), 0x1003);
            D_8020DCAC((*(s32 *)((u8 *)(ctx) + (0x10))), 0x1004);
            break;
        case 0x1004:
            break;
    }
    return 0;
}
s32 func_002A7A6C(u16 msg);
